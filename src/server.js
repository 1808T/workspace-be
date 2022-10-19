import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { exit } from 'process';

import env from './configs/env.config.js';
import { connectToDatabase } from './configs/db.config.js';

import userRouter from './routes/user.route.js';
import boardRouter from './routes/board.route.js';
import listRouter from './routes/list.route.js';
import cardRouter from './routes/card.route.js';
import messageRouter from './routes/message.route.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/api', userRouter);
app.use('/api', boardRouter);
app.use('/api', listRouter);
app.use('/api', cardRouter);
app.use('/api', messageRouter);

app.get('/', async (req, res) => {
  res.json({ message: 'Server is running.' });
});

const PORT = env.PORT || 8080;
app.listen(PORT, async (error) => {
  if (error) {
    console.log(error);
    exit(1);
  } else {
    await connectToDatabase();
    console.log(`Server is running on port ${PORT}`);
  }
});
