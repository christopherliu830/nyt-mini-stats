import { TableContainer, Table, Tr, Td, Tbody, Text, Thead, Th } from '@chakra-ui/react';
import { scaleLinear } from 'd3';

const Cell = (props) => (
  <Td border="2px solid rgba(0, 0, 0, 0.2)" textAlign="center" fontSize="24px" fontWeight="600" {...props} />
);

export function PuzzleGrid({ solve }) {
  console.log(solve);
  const { cells } = solve.board;
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

  const color = scaleLinear().domain([0, solve.calcs.secondsSpentSolving])
    .range(['white', 'lightblue']);

  return (
    <>
      <TableContainer>
        <Table w="300px" border="4px solid" borderColor="black">
          <Thead>
            <Th colSpan="5" textAlign="center" borderBottom="2px solid" borderColor="black">
              Me
            </Th>
          </Thead>
          <Tbody h="300px">
            {rows.map((row) => (
              <Tr>
                {row.map((cell) => (
                  <Cell bg={color(cell.timestamp)}>{cell.guess}</Cell>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}
