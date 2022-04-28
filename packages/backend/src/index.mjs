import express from 'express';
import { createClient } from 'redis';
import { accounts } from './config.mjs';
import { storage } from './storage.mjs';
import * as nyt from './api/nyt.mjs';

const redis = createClient();
await redis.connect();
redis.on('error', console.log);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const router = express.Router();
app.use('/api', router);

router.post('/login', async (req, res) => {

  if (await redis.get(req.body.username)) {
    res.status(200).send();
  }

  const username = req.body.username;
  const password = req.body.password;

  try {
    const token = await nyt.getToken(username, password);
    redis.set(username, token);
    res.status(200).send();
  }
  catch (e) {
    res.status(500).send();
    console.log(e);
  }
})

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
  res.status(201).send();
})

router.get('/puzzles', async (req, res) => {
  try {
    const response = await nyt.getPuzzles(req.token);
    res.status(200).send(response);
  }
  catch (e) {
    res.status(404).send({ message: 'puzzles not found' });
  }
})

router.get('/users', async (req, res) => {
  const users = await storage.get('users');
  res.status(200).send(users);
})

router.post('/solves', async (req, res) => {
  try {
    const response = await nyt.getSolves(req.token, req.body);
    res.status(200).send(response);
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: 'solves not found' })
  }
})

app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Listening on ${process.env.PORT}`);
});
