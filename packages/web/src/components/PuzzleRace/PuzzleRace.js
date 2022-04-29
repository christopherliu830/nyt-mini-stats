import { useMemo, useState } from 'react';
import { Box, Text, Slider, SliderTrack, SliderThumb, SliderFilledTrack } from '@chakra-ui/react';
import { PuzzleGrid } from '../PuzzleGrid';

export function PuzzleRace({ date, solves }) {
  const [time, setTime] = useState(999);

  const slowestTime = solves
    ?.map((solve) => solve.puzzle.calcs.secondsSpentSolving)
    .sort((a, b) => a - b)
    .pop();

  if (!solves || solves.length === 0) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box borderRadius={8} outline="solid 1px" outlineColor="gray.100" shadow="md" overflow="hidden">
      <Box m="4 auto" d="flex" p="8px" gap="8px" flexWrap="wrap" minW="0">
        {solves.map((solve) => (
          <PuzzleGrid
            key={solve.user}
            date={date}
            solve={solve}
            label={solve.user}
            puzzle={solve.puzzle}
            viewTime={time}
          />
        ))}
      </Box>
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
