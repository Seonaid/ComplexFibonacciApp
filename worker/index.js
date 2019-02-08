const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
});

// sub stands for subscription. we are listening for incoming requests that arrive at the
// redis... client?

const sub = redisClient.duplicate();

// we are deliberately using a slow process here so that the "benefit" of using the redis
// server becomes apparent, as well as using the worker to calculate the f. values
// I wouldn't really calculate fibonnaci numbers this way.

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));

  // key is message, value is the fibonnaci number
});

sub.subscribe('insert'); // listens for an insert event (which is made by the express app line 78)