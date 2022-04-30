import { Fragment } from 'react';
import { Box, Text } from '@chakra-ui/react';
import {
  AnimatedAxis,
  Annotation,
  AnnotationCircleSubject,
  AnnotationLabel,
  LineSeries,
  Tooltip,
  XYChart,
  defaultColors,
} from '@visx/xychart';
import { curveBumpX, min, range } from 'd3';

export function LineChart({ solves, viewTime }) {

  const puzzles = solves
    .filter(solve => solve.puzzle)
    .map((solve) => ({ user: solve.user, ...solve.puzzle }))

  const slowestTime = puzzles
    ?.map((puzzle) => puzzle.calcs.secondsSpentSolving)
    .sort((a, b) => a - b)
    .pop();

  // All puzzle boards are the same, just get first one
  const cellCount = puzzles[0]?.board.cells.filter((c) => !c.blank).length;

  const formatPuzzle = (puzzle) => {
    const cells = puzzle.board.cells.filter((c) => c.timestamp !== undefined);
    cells.sort((a, b) => a.timestamp - b.timestamp);

    const points = [0];

    cells
      .filter((cell) => viewTime >= cell.timestamp)
      .forEach((cell, idx) => {
        points[cell.timestamp] = idx + 1;
      });

    // Fill in the seconds that don't have a time value
    // Just use the last value to fill in so the graph has a value for every point.
    let lastValue = 0;
    const end = min([puzzle.calcs.secondsSpentSolving, viewTime]) + 1;
    const marks = range(end).map((time, _) => {
      if (points[time]) {
        lastValue = points[time];
      }

      return {
        x: time,
        y: points[time] || lastValue,
      };
    });

    return marks;
  };

  const accessors = {
    xAccessor: (d) => d?.x,
    yAccessor: (d) => d?.y,
  };

  return (
    <Box shadow="inset">
      <XYChart
        height={320}
        margin={{ top: 20, right: 40, bottom: 30, left: 40 }}
        xScale={{ type: 'linear', domain: [0, slowestTime], clamp: true }}
        yScale={{ type: 'linear', domain: [0, cellCount], clamp: true }}
      >
        <AnimatedAxis orientation="bottom" />
        {solves &&
          puzzles.map((puzzle, idx) => {
            const data = formatPuzzle(puzzle);
            const annotationDatum = data[min([viewTime, data.length - 1])];
            console.log(annotationDatum, data, puzzle.user);
            return (
              <Fragment key={puzzle.user}>
                <LineSeries dataKey={puzzle.user} data={data} curve={curveBumpX} {...accessors} />
                <Annotation dataKey={puzzle.user} datum={annotationDatum} {...accessors}>
                  <AnnotationCircleSubject radius={4} stroke={defaultColors[idx % defaultColors.length]} />
                  <AnnotationLabel
                    showAnchorLine={false}
                    showBackground={false}
                    horizontalAnchor="start"
                    verticalAnchor="middle"
                    titleProps={{ fill: defaultColors[idx % defaultColors.length] }}
                    title={puzzle.user}
                  />
                </Annotation>
              </Fragment>
            );
          })}
        <Tooltip
          snapTooltipToDatumX
          snapTooltipToDatumY
          showVerticalCrosshair
          showSeriesGlyphs
          detectBounds
          glyphStyle={{ width: 0 }}
          renderTooltip={({ tooltipData, colorScale }) => (
            <Box p={1}>
              <Text fontSize="lg" fontWeight="300" mb={3}>
                Time: {accessors.xAccessor(tooltipData?.nearestDatum?.datum)}
              </Text>
              {Object.keys(tooltipData?.datumByKey ?? {}).map((name) => (
                <Box key={name} color={colorScale(name)}>
                  <Text fontSize="md" mb={1}>
                    {name}: {accessors.yAccessor(tooltipData?.datumByKey[name].datum)}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        />
      </XYChart>
    </Box>
  );
}
