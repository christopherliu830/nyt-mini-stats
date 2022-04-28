import { Table, Tr, Td, Tbody, Thead, Th, Text } from '@chakra-ui/react';
import { scaleLinear } from 'd3';
import { useState, useEffect, useMemo } from 'react';
import { puzzleByDate } from '../../api/nyt';

const Cell = (props) => (
  <Td
    border="2px solid rgba(0, 0, 0, 0.2)"
    textAlign="center"
    fontWeight="600"
    p="0"
    {...props}
  />
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
    <Table w="220px" border="4px solid" borderColor="black" tableLayout="fixed">
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
          <Tr key={idx}>
            {row.map((cell, idx) => (
              <Cell key={idx} bg={getColor(cell.timestamp)} w={`${(100/width)}%`}>
                <Text position="relative" fontSize="2xl">
                  {cell.guess}
                </Text>
              </Cell>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
