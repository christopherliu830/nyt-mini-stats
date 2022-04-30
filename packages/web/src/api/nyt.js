const baseUrl = process.env.REACT_APP_BASE_URL;

export async function login({ username, token }) {
  const response = await fetch(baseUrl + '/api/set-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ username, token }),
  });
  const data = await response.text();
  return data;
}

export async function puzzleByDate(name, date) {
  const response = await fetch(baseUrl + `/api/puzzles?name=${name}&date=${date}`);
  const data = await response.json();
  return data[0];
}

export async function getPuzzles(name) {
  const response = await fetch(baseUrl + `/api/puzzles?name=${name}`);
  const data = await response.json();
  return data;
}

export async function getSolves(name, puzzles) {
  console.log('getsolves', name);
  const response = await fetch(baseUrl + `/api/solves?name=${name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(puzzles),
  });
  const data = await response.json();
  return data;
}

export async function getUsers() {
  const response = await fetch(baseUrl + `/api/users`);
  const data = await response.json();
  return data;
}
