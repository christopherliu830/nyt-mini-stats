import { useEffect, useState } from 'react';
import { Box, Button, ChakraProvider, Container, FormControl, FormLabel, Input, Text } from '@chakra-ui/react';
import { getPuzzles, getUsers, puzzleByDate } from './api/nyt';
import { PuzzleGrid } from './components/PuzzleGrid';
import { Leaderboard } from './components/Leaderboard';
import { DatePicker } from './components/DatePicker';
import { timeFormat } from 'd3';

const formatDate = timeFormat('%Y-%m-%d');

function App() {
  const [users, setUsers] = useState([]);
  const [date, setDate] = useState(new Date());
  const [solves, setSolves] = useState(undefined);

  useEffect(() => {
    getUsers().then(setUsers);
  }, [])

  useEffect(() => {
    const dateString = formatDate(date); 
    Promise.all(users.map(async user => ({ user, puzzle: await puzzleByDate(user, dateString) })))
      .then(setSolves);
  }, [users, date]);

  return (
    <ChakraProvider>
      <div>
        <Container maxW="container.xl">
          <DatePicker p="8px 0" selected={date} onChange={setDate} w="240px" />
          Test Test
          <Box ml="auto" mr="auto" d="flex" p="8px 0" gap="8px" flexWrap="wrap" minW="0">
          {
            solves && solves.map(solve => (
              <PuzzleGrid date={date} key={solve.user} label={solve.user} puzzle={solve.puzzle} />
            ))
          }
          </Box>
          {solves && <Leaderboard p="8px 0" stats={solves} />}
        </Container>
      </div>
    </ChakraProvider>
  );
}

export default App;
