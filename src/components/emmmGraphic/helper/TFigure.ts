import { TPoint } from '@/components/emmmGraphic';

class TFigure {
  distance(point: TPoint): number {
    throw new SyntaxError('Нельзя вызвать метод у абстрактного класса!');
  }
}

export { TFigure };
