import { min, utcFormat, utcMonth, utcDay, utcParse } from 'd3';

const API_ROOT = 'https://nyt-games-prd.appspot.com/svc/crosswords';
const PUZZLE_INFO = `${API_ROOT}/v3/puzzles.json`;
const SOLVE_INFO = `${API_ROOT}/v6/game`;
const DATE_FORMAT = '%Y-%m-%d';

export function range() {
  const today = new Date();
  const dateFormat = utcFormat(DATE_FORMAT);
  const starts = utcMonth
    .every(3)
    .range(new Date().setFullYear(today.getFullYear() - 1) , today, 1);

  const ranges = starts.map((start) => ({
    start: dateFormat(start),
    end: dateFormat(min([today, utcDay.offset(utcMonth.offset(start, 3), -1)]))
  }));

  return ranges;
}

export async function getPuzzles(token) {
  const dateParser = utcParse(DATE_FORMAT);
  const ranges = range();
  return (
    await Promise.all(ranges.map(({start, end}) => {
      const searchParams = new URLSearchParams({
        publish_type: 'mini',
        date_start: start,
        date_end: end,
        sort_order: 'asc',
        sord_by: 'print_date'
      }).toString();
      const url = `${PUZZLE_INFO}?${searchParams}`;
      return requestNyt(url, token);
    }))
  )
    .map(puzzle => puzzle.results)
    .flat()
    .map(puzzle => ({ ...puzzle, date: dateParser(puzzle.print_date) }));
}

export async function getSolves(token, puzzles) {
  const getSolve = async (puzzle) => {
    const response = await requestNyt(`${SOLVE_INFO}/${puzzle.puzzle_id}.json`, token)
    return { ...puzzle, ...response };
  };

  console.log(puzzles.filter(p => p))
  console.log(puzzles)

  const solves = await Promise.all(puzzles.filter(p => p.solved).map(getSolve))
  return solves
}

async function requestNyt(path, token) {
  const key = hashCode(path + token);
  if (localStorage?.getItem(key)) return JSON.parse(localStorage.getItem(key));
  const response = await fetch(path, { headers: { 'nyt-s': token }, });
  const data = await response.json();
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}

const hashCode = function(str) {
  var hash = 0, i, chr;
  if (str.length === 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr   = str.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};