import { MongoClient } from 'mongodb';
import env from './env.config.js';

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const client = new MongoClient(env.MONGODB_URI, connectionParams);

const showDbs = async (client) => {
  const { databases } = await client.db().admin().listDatabases();
  console.log(databases);
};

const dbName = 'workspaceManagement';
export const db = {};

export const connectToDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Successfully connect to database!!!');
    await showDbs(client);

    const database = client.db(dbName);

    db.users = database.collection('users');
    db.boards = database.collection('boards');
    db.lists = database.collection('lists');
    db.cards = database.collection('cards');
    db.messages = database.collection('messages');
    db.logs = database.collection('logs');
    db.comments = database.collection('comments');

    return 'Done.';
  } catch (error) {
    console.log('Connection failed.');
    console.log(`Detail: ${error}`);
  }
};
