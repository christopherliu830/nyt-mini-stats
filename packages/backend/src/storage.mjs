import { createClient } from 'redis';
import { accounts } from './config.mjs';

const redis = createClient({ prefix: 'nyt-mini-stats:' });
redis.connect();
redis.on('error', (e) => {
  console.log(e);
  console.trace();
});

export const storage = {
  get: async (key) => {
    const type = await redis.TYPE(key);
    if (type === 'list') {
      return await redis.lRange(key, 0, -1);
    }
    else if (type === 'set') {
      return await redis.sMembers(key);
    }
    else {
      return await redis.get(key);
    }
  },
  set: async (key, val, options) => await redis.set(key, val, options),

  push: async (key, val) => await redis.lPush(key, val),

  pushSet: async (key, val) => await redis.sAdd(key, val)
}

for(const account of accounts) {
  storage.set(account.name, account.token);
  storage.pushSet('users', account.name);
}