import { Table, Tr, Td, Tbody, Thead, Th, Text } from '@chakra-ui/react';
import { scaleLinear } from 'd3';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { puzzleByDate } from '../../api/nyt';

const Cell = (props) => (
  <Td border="2px solid rgba(0, 0, 0, 0.2)" textAlign="center" fontWeight="600" p="0" {...props} />
);

const createColorScale = (color, domain) => scaleLinear().domain(domain).range(['white', color]);

export function PuzzleGrid({ puzzle, label, viewTime }) {

  const { cells } = puzzle.board;
  const width = Math.floor(Math.sqrt(cells.length));
  const height = width;
  const rows = [];

  for (let i = 0; i < width; i++) {
    const row = [];
    for (let j = 0; j < height; j++) {
      row.push(cells[i * width + j]);
    }
    rows.push(row);
  }

  const blue = createColorScale('blue', [0, puzzle.calcs.secondsSpentSolving]);
  const yellow = createColorScale('yellow', [0, puzzle.calcs.secondsSpentSolving]);
  const red = createColorScale('red', [0, puzzle.calcs.secondsSpentSolving]);

  const visibilityArray = puzzle.board.cells.map(cell => viewTime > cell.timestamp);

  const drawCell = useCallback((cell, key) => {
    const visibility = (cell.blank || viewTime > cell.timestamp) ? 'visible' : 'hidden';

    let bg = 'white';
    if (cell.checked) {
      bg = red(cell.timestamp);
    }
    else if (cell.confirmed) {
      bg = yellow(cell.timestamp);
    }
    else if (cell.blank) {
      bg = 'black';
    }
    else {
      bg = blue(cell.timestamp)
    }

    return (
      <Cell
        key={key}
        bg={bg}
        w={`${100 / width}%`}
        visibility={visibility}
      >
        <Text position="relative" fontSize="2xl">
          {cell.guess}
        </Text>
      </Cell>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, visibilityArray);

  if (!puzzle) {
    return <></>;
  }

  return (
    <Table w="220px" border="4px solid" borderColor="black" tablelayout="fixed">
      <Thead>
        <Tr>
          <Th colSpan={width} textAlign="center" borderBottom="2px solid" borderColor="black">
            <Text position="relative" fontSize="2xl">
              {label} - {puzzle.calcs.secondsSpentSolving}
            </Text>
          </Th>
        </Tr>
      </Thead>
      <Tbody h="220px">
        {rows.map((row, idx) => (
          <Tr key={idx}>{row.map(drawCell)}</Tr>
        ))}
      </Tbody>
    </Table>
  );
}
