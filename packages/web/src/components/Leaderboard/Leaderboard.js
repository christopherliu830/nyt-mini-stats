import { Box, Table, Tbody, Th, Thead, Tr, Td } from '@chakra-ui/react';

export function Leaderboard({ stats, ...rest }) {
  const placements = [...stats].sort(
    (a, b) => a.puzzle?.calcs.secondsSpentSolving - b.puzzle?.calcs.secondsSpentSolving
  );

  return (
    <Table
      {...rest}
      borderRadius={8}
      outline="solid 1px"
      outlineColor="gray.100"
      shadow="md"
      overflow="hidden"
      position="relative"
      mt={4}
      mb={4}
    >
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Time</Th>
        </Tr>
      </Thead>
      <Tbody>
        {placements.map(({ user, puzzle }) => (
          <Tr key={user}>
            <Td fontWeight={600}>{user}</Td>
            <Td>{puzzle?.calcs.secondsSpentSolving ?? 'Not Done'}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}
