import fetch from 'node-fetch';
import { min, utcFormat, utcMonth, utcDay, utcParse } from 'd3';
import { storage } from '../storage.mjs';
import { request } from 'express';

const API_ROOT = 'https://nyt-games-prd.appspot.com/svc/crosswords';
const PUZZLE_INFO = `${API_ROOT}/v3/puzzles.json`;
const SOLVE_INFO = `${API_ROOT}/v6/game`;
const DATE_FORMAT = '%Y-%m-%d';
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

export async function puzzleByDate(token, date) {
  const puzzle = await getPuzzles(token, {
    start: formatDate(utcDay.offset(parseDate(date), -1)),
    end: formatDate(utcDay.offset(parseDate(date)))
  });

  const solves = await getSolves(token, [puzzle]);
  return { ...puzzle, ...solves[0] };
}

export async function getPuzzles(token, dates) {
  const ranges = dates ? [dates] : range();
  const puzzles = (
    await Promise.all(ranges.map(({start, end}) => {
      const searchParams = new URLSearchParams({
        publish_type: 'mini',
        date_start: start,
        date_end: end,
        sort_order: 'asc',
        sort_by: 'print_date'
      }).toString();
      const url = `${PUZZLE_INFO}?${searchParams}`;
      return requestNyt(url, token);
    }))
  )
    .map(puzzle => puzzle.results)
    .flat()
    .map(puzzle => ({ ...puzzle, date: parseDate(puzzle.print_date) }));

  return await getSolves(token, puzzles);
}

async function getSolves(token, puzzles) {
  console.log(token, puzzles);
  const getSolve = async (puzzle) => {
    const response = await requestNyt(`${SOLVE_INFO}/${puzzle.puzzle_id}.json`, token)
    return { ...puzzle, ...response };
  };

  const solves = await Promise.all(puzzles.filter(p => p.solved).map(getSolve))
  return solves;
}

async function requestNyt(path, token = '') {
  const key = hashCode(path + token);

  if (await storage?.get(key)) return JSON.parse(await storage.get(key));

  const response = await fetch(path, { headers: { 'nyt-s': token }, });
  const data = await response.json();

  if (storage) {
    await storage.set(key, JSON.stringify(data));
  }

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