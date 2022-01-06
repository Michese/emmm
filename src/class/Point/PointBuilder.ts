import { memoCellCount, memoAxisEnd, memoShiftCells, Point, TPoint, memoRemainderShift, memoAxisLengthUnit } from '@/class';

class PointBuilder {
  shiftXPx!: number;
  shiftYPx!: number;
  cellSizePx!: number;
  cellSizeUnit!: number;
  heightPx!: number;
  widthPx!: number;
  value?: number;

  setShiftXPx(shiftXPx: number): PointBuilder {
    this.shiftXPx = shiftXPx;
    return this;
  }

  setShiftYPx(shiftYPx: number): PointBuilder {
    this.shiftYPx = shiftYPx;
    return this;
  }

  setCellSizePx(newValue: number): PointBuilder {
    this.cellSizePx = newValue;
    return this;
  }

  setCellSizeUnit(newValue: number): PointBuilder {
    this.cellSizeUnit = newValue;
    return this;
  }

  setHeightPx(newValue: number): PointBuilder {
    this.heightPx = newValue;
    return this;
  }

  setWidthPx(newValue: number): PointBuilder {
    this.widthPx = newValue;
    return this;
  }

  setValue(newValue: number): PointBuilder {
    this.value = newValue;
    return this;
  }

  static cellCount(lengthPx: number, cellSizePx: number): number {
    return memoCellCount(lengthPx, cellSizePx);
  }

  get cellCountX(): number {
    return PointBuilder.cellCount(this.widthPx, this.cellSizePx);
  }

  get cellCountY(): number {
    return PointBuilder.cellCount(this.heightPx, this.cellSizePx);
  }

  static axisLengthUnit(cellCount: number, cellSizeUnit: number): number {
    return memoAxisLengthUnit(cellCount, cellSizeUnit);
  }

  get widthUnit(): number {
    return PointBuilder.axisLengthUnit(this.cellCountX, this.cellSizeUnit);
  }

  get heightUnit(): number {
    return PointBuilder.axisLengthUnit(this.cellCountY, this.cellSizeUnit);
  }

  static axisBegin(shift: number, cellSize: number): number {
    return memoShiftCells(shift, cellSize);
  }

  get beginXUnit(): number {
    return PointBuilder.axisBegin(this.shiftXPx, this.cellSizePx);
  }

  get beginYUnit(): number {
    return PointBuilder.axisBegin(this.shiftYPx, this.cellSizePx);
  }

  static axisEnd(axisLength: number, shiftCells: number): number {
    return memoAxisEnd(axisLength, shiftCells);
  }

  get endXUnit(): number {
    return PointBuilder.axisEnd(this.widthUnit, this.beginXUnit);
  }

  get endYUnit(): number {
    return PointBuilder.axisEnd(this.heightUnit, this.beginYUnit);
  }

  static remainderShift(shift: number, cellSizeUnit: number, cellSize: number): number {
    return memoRemainderShift(shift, cellSizeUnit, cellSize);
  }

  get remainderShiftAxisX(): number {
    return PointBuilder.remainderShift(this.shiftXPx, this.cellSizeUnit, this.cellSizePx);
  }

  get remainderShiftAxisY(): number {
    return PointBuilder.remainderShift(this.shiftYPx, this.cellSizeUnit, this.cellSizePx);
  }

  createPoint({ x, y, value }: TPoint): Point {
    return new Point(this.shiftXPx, this.shiftYPx, this, { x, y, value: value ?? this.value });
  }
}

export { PointBuilder };
