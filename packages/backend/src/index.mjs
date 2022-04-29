import express from 'express';
import cors from 'cors';
import { storage } from './storage.mjs';
import * as nyt from './api/nyt.mjs';

const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = express.Router();
app.use('/api', router);

router.use(async (req, res, next) => {
  if (req.query.name) {
    const token = await storage.get(req.query.name);
    if (token) req.token = token;
  }
  next();
})

router.post('/set-token', async (req, res) => {
  const name = req.body.username;
  const token = req.body.token;

  if (await storage.get(name)) {
    res.status(200).send();
  }

  await storage.set(name, token);
  await storage.pushSet('users', name);
  res.status(201).send();
})

router.get('/puzzles', async (req, res) => {
  try {
    let response;
    const useCache = req.query.useCache;
    if (req.query.date) {
      response = await nyt.puzzleByDate(req.token, req.query.date, useCache ?? true);
    }
    else {
      response = await nyt.getPuzzles(req.token, undefined, useCache ?? true);
    }
    res.status(200).send(response);
  }
  catch (e) {
    console.log(e);
    res.status(500).send({ message: 'puzzles not found' });
  }
})

router.get('/', async (req, res) => {
  try {
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
})

router.get('/users', async (req, res) => {
  const users = await storage.get('users');
  res.status(200).send(users);
})

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
