import fetch from 'node-fetch';
import { min, utcFormat, utcMonth, utcDay, utcParse, max } from 'd3';
import { storage } from '../storage.mjs';
import { request } from 'express';

const API_ROOT = 'https://nyt-games-prd.appspot.com/svc/crosswords';
const PUZZLE_INFO = `${API_ROOT}/v3/puzzles.json`;
const SOLVE_INFO = `${API_ROOT}/v6/game`;
const DATE_FORMAT = '%Y-%m-%d';
const EXPIRE_TIME = 60 * 60 * 12; // Cache key duration
const parseDate = utcParse(DATE_FORMAT);
const formatDate = utcFormat(DATE_FORMAT);

export function range() {
  const today = new Date();
  const starts = utcMonth
    .every(3)
    .range(new Date().setFullYear(today.getFullYear() - 1) , today, 1);

  const ranges = starts.map((start) => ({
    start: formatDate(start),
    end: formatDate(min([today, utcDay.offset(utcMonth.offset(start, 3), -1)]))
  }));

  return ranges;
}

/**
 * Massage the data so that the puzzle info makes more logical sense
 * @param {object} puzzle 
 */
function adjust(puzzle) {
  // Line up secondsSpentSolving and the last cell's timestamp.
  if (puzzle.calcs.secondsSpentSolving) {
    const delta = puzzle.calcs.secondsSpentSolving - max(puzzle.board.cells, c => c.timestamp);
    puzzle.board.cells = puzzle.board.cells.map(cell => ({
      ...cell,

      // Sometimes the last timestamp is greater than secondsSpentSolving, in that case clamp values 
      timestamp: cell.timestamp && max([0, cell.timestamp + delta]),
    }))
  }
  return puzzle;
}

export async function puzzleByDate(token, date, useCache) {
  const puzzle = await getPuzzles(token, {
    start: formatDate(parseDate(date)),
    end: formatDate(utcDay.offset(parseDate(date)))
  }, useCache);

  const solves = await getSolves(token, [puzzle]);
  return { ...puzzle, ...solves[0] };
}

export async function getPuzzles(token, dates, useCache) {

  const ranges = dates ? [dates] : range();
 
  const search = async (cached) => (
    (await Promise.all(ranges.map(({start, end}) => {
      const searchParams = new URLSearchParams({
        publish_type: 'mini',
        date_start: start,
        date_end: end,
        sort_order: 'asc',
        sort_by: 'print_date'
      }).toString();
      const url = `${PUZZLE_INFO}?${searchParams}`;
      return requestNyt(url, token, cached);
    })))
      .map(puzzle => puzzle.results)
      .flat()
      .filter(puzzle => puzzle) // Filter out null result queries
      .map(puzzle => ({ ...puzzle, date: parseDate(puzzle.print_date)}))
  )

  let puzzles = await search(useCache);
    
  if (puzzles.length === 0) {
    let puzzles = await search(false); // Force the query again if no results found.
  }

  const solves = await getSolves(token, puzzles);
  return solves.map(adjust);
}

async function getSolves(token, puzzles) {
  const getSolve = async (puzzle) => {
    const response = await requestNyt(`${SOLVE_INFO}/${puzzle.puzzle_id}.json`, token)
    return { ...puzzle, ...response };
  };

  const solves = await Promise.all(puzzles.filter(p => p.solved).map(getSolve))
  return solves;
}

async function requestNyt(path, token = '', useCache = true) {
  const key = `${token}:${path}`;
  if (useCache && await storage?.get(key)) {
    return JSON.parse(await storage.get(key));
  }

  const response = await fetch(path, { headers: { 'nyt-s': token }, });
  const data = await response.json();

  if (storage) {
    await storage.set(key, JSON.stringify(data));
    storage.expire(key, EXPIRE_TIME);
  }

  return data;
}
