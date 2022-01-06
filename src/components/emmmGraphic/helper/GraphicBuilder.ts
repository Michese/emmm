import { TFigure } from '.';

class GraphicBuilder {
  startXUnit = -20;
  startYUnit = -20;
  endXUnit = 20;
  endYUnit = 20;
  sizeCellUnit = 5;
  sizeCellPx = 10;

  get ratioSizeCell(): number {
    return this.sizeCellPx / this.sizeCellUnit;
  }

  setSizeCellPx(sizeCellPx: number): GraphicBuilder {
    this.sizeCellPx = sizeCellPx;
    return this;
  }

  setRangeX(startXUnit: number, endXUnit: number): GraphicBuilder {
    if (startXUnit >= endXUnit) throw new SyntaxError('Начало не может быть больше конца!');
    this.startXUnit = startXUnit;
    this.endXUnit = endXUnit;
    return this;
  }

  setRangeY(startYUnit: number, endYUnit: number): GraphicBuilder {
    if (startYUnit >= endYUnit) throw new SyntaxError('Начало не может быть больше конца!');
    this.startYUnit = startYUnit;
    this.endYUnit = endYUnit;
    return this;
  }

  // TODO Реализовать метод расчета границ
  calcRange(figures: TFigure[]): GraphicBuilder {
    return this;
  }

  setSizeUnit(sizeCellUnit: number): GraphicBuilder {
    if (sizeCellUnit <= 0) throw new SyntaxError('Ширина ячейки не может быть меньше или равна нулю!');
    this.sizeCellUnit = sizeCellUnit;
    return this;
  }
}

export { GraphicBuilder };
