import { useEffect, useState } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { getPuzzles, getSolves, range } from './api/nyt';
import { PuzzleGrid } from './components/PuzzleGrid';

const cookie = process.env.REACT_APP_NYT_TOKEN;

function App() {
  const [solves, setSolves] = useState();

  useEffect(() => {
    (async () => {
      const dates = range()[0];
      const data = await getPuzzles(cookie, {
        publish_type: 'mini',
        date_start: dates.start,
        date_end: dates.end
      })
      const solves = await getSolves(cookie, data);
      setSolves(solves);
    })();
  }, [])

  const solve = solves && solves[solves.length - 1];

  if (!solve) return <></>;

  return (
    <ChakraProvider>
      <PuzzleGrid solve={solve} />
    </ChakraProvider>
  );
}

export default App;
