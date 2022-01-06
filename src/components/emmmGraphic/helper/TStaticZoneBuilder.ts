import { TLine, TPoint } from '@/components/emmmGraphic';

class TStaticZoneBuilder {
  static pointsAxis(lines: TLine[], startX: number, endX: number, startY: number, endY: number): TPoint[] {
    const points: (TPoint | null)[] = lines.flatMap((firstLine, index) =>
      lines.slice(index + 1, lines.length).map(secondLine => TLine.intersectionPoint(firstLine, secondLine)),
    );
    const filteredPoints: TPoint[] = points.filter(
      point => point && point.x >= startX && point.x <= endX && point.y >= startY && point.y <= endY && lines.every(line => line.checkPoint(point)),
    ) as TPoint[];
    const linesForSortedPoints = [...lines],
      beginPoint = filteredPoints.splice(0, 1)[0],
      filteredPointsForSortedPoints = [...filteredPoints];

    let previousPoint: TPoint = beginPoint,
      foundedLine: TLine = linesForSortedPoints.splice(
        linesForSortedPoints.findIndex(line => line.checkPointOnLine(previousPoint)),
        1,
      )[0];

    const sortedPoints: TPoint[] = filteredPoints.map(item => {
      const pointIndex = filteredPointsForSortedPoints.findIndex(point => foundedLine.checkPointOnLine(point));
      previousPoint = filteredPointsForSortedPoints.splice(pointIndex, 1)[0];
      foundedLine = linesForSortedPoints.splice(
        linesForSortedPoints.findIndex(line => line.checkPointOnLine(previousPoint)),
        1,
      )[0];
      return previousPoint;
    });
    sortedPoints.push(beginPoint);
    return sortedPoints;
  }

  static pointsOfIntersection(lines: TLine[]): TPoint[] {
    return lines
      .flatMap((firstLine, index) => lines.slice(index + 1, lines.length).map(secondLine => TLine.intersectionPoint(firstLine, secondLine)))
      .filter(line => line) as TPoint[];
  }
}

export { TStaticZoneBuilder };
