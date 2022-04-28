import { useEffect, useState } from 'react';
import { Box, ChakraProvider, Text } from '@chakra-ui/react';
import { getPuzzles, getSolves, getUsers, login } from './api/nyt';
import { PuzzleGrid } from './components/PuzzleGrid';

const cookie = process.env.REACT_APP_NYT_TOKEN;

function App() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    (async () => {
      const allUsers = await getUsers();
      allUsers.forEach(async user => {
        const puzzles = await getPuzzles(user);
        const solves = await getSolves(user, puzzles);
        setUsers((data) => ({
          [user]: { puzzles, solves },
          ...data
        }));
      })
    })();
  }, [])

  const user = Object.values(users)[0];
  const latestSolve = user?.solves[user.solves.length-1];

  return (
    <ChakraProvider>
      <Box p="16px">
        { latestSolve && <Text fontSize="3xl" fontWeight="600">{new Date(latestSolve.print_date).toDateString()}</Text> }
        <Box d="flex">
        {
          Object.entries(users).map(([user, { solves }]) => (
            <PuzzleGrid label={user} solve={solves[solves.length-1]} />
          ))
        }
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
