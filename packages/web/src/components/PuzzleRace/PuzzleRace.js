import { useState } from 'react';
import { Box, Text, Slider, SliderTrack, SliderThumb, SliderFilledTrack } from '@chakra-ui/react';
import { PuzzleGrid } from '../PuzzleGrid';
import { LineChart } from '../LineChart';

export function PuzzleRace({ date, solves }) {
  const [time, setTime] = useState();

  if (!solves || solves.length === 0) {
    return <Text>Loading...</Text>;
  }

  const slowestTime = solves
    ?.map((solve) => solve.puzzle?.calcs.secondsSpentSolving)
    .sort((a, b) => a - b)
    .pop();

  return (
    <Box borderRadius={8} outline="solid 1px" outlineColor="gray.100" shadow="md" overflow="hidden">
      <Box display="flex" m="4px auto" p="8px" gap="8px" flexWrap="wrap" minW="0">
        {solves.map((solve) => (solve.puzzle && 
          <PuzzleGrid
            key={solve.user}
            date={date}
            solve={solve}
            label={solve.user}
            puzzle={solve.puzzle}
            viewTime={time || slowestTime}
          />
        ))}
      </Box>
      <LineChart solves={solves} viewTime={time || slowestTime}/>
      <Box p={4} m={0} bg="gray.100">
        <Slider min={0} max={slowestTime} value={time || slowestTime} onChange={setTime}>
          <SliderTrack boxSize={2}>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb boxSize={4} />
        </Slider>
      </Box>
    </Box>
  );
}
