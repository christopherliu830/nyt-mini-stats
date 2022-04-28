import { min, utcFormat, utcMonth, utcDay, utcParse } from 'd3';

const API_ROOT = 'https://nyt-games-prd.appspot.com/svc/crosswords';
const PUZZLE_INFO = `${API_ROOT}/v3/puzzles.json`;
const SOLVE_INFO = `${API_ROOT}/v6/game`;
const DATE_FORMAT = '%Y-%m-%d';

export async function login({ username, token }) {
  const response = await fetch('/api/set-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ username, token })
  })
  const data = await response.text();
  return data;
}

export async function getPuzzles(name) {
  const response = await fetch(`/api/puzzles?name=${name}`)
  const data = await response.json();
  return data;
}

export async function getSolves(name, puzzles) {
  const response = await fetch(`/api/solves?name=${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(puzzles)
  })
  const data = await response.json();
  return data;
}

export async function getUsers() {
  const response = await fetch(`/api/users`);
  const data = await response.json();
  return data;
}
