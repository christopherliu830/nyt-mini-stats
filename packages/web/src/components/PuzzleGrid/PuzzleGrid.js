import { Table, Tr, Td, Tbody, Thead, Th } from '@chakra-ui/react';
import { scaleLinear } from 'd3';
import { useState, useEffect, useMemo } from 'react';
import { puzzleByDate } from '../../api/nyt';

const Cell = (props) => (
  <Td border="2px solid rgba(0, 0, 0, 0.2)" textAlign="center" fontSize="24px" fontWeight="600" {...props} />
);

export function PuzzleGrid({ puzzle, label}) {
  if (!puzzle) { return <></>; }

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

  const color = scaleLinear().domain([0, puzzle.calcs.secondsSpentSolving])
    .range(['white', 'cornflowerblue']);

  const getColor = x => x ? color(x) : 'black';

  return (
    <Table w="300px" border="4px solid" borderColor="black">
      <Thead>
        <Tr>
          <Th colSpan="5" textAlign="center" borderBottom="2px solid" borderColor="black">
            {label} - {puzzle.calcs.secondsSpentSolving}
          </Th>
        </Tr>
      </Thead>
      <Tbody h="300px">
        {rows.map((row, idx) => (
          <Tr key={idx}>
            {row.map((cell, idx) => (
              <Cell key={idx} bg={getColor(cell.timestamp)}>{cell.guess}</Cell>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
