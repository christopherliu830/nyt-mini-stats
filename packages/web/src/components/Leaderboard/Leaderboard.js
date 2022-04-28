import { Table, Tbody, Th, Thead, Tr, Td } from "@chakra-ui/react";

export function Leaderboard({ stats, ...rest }) {
  const placements = [...stats].sort((a, b) => (
    a.puzzle?.calcs.secondsSpentSolving - b.puzzle?.calcs.secondsSpentSolving
  ));

  return (
    <Table {...rest} w="400px">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        { placements.map(({ user, puzzle }) => (
          <Tr key={user}>
            <Td>{user}</Td>
            <Td>{puzzle?.calcs.secondsSpentSolving ?? 'Not Done'}</Td>
          </Tr>

        ))}
      </Tbody>
    </Table>
  )
}