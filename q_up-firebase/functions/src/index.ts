import * as functions from 'firebase-functions';
import { getQueues, enterQueue } from './handlers/queues';
import * as express from 'express';
import { signup, login } from './handlers/users';
import { FBAuth } from './util/fbAuth';

const app = express();

// all routes start with https://us-central1-q-up-c2b70.cloudfunctions.net/api

// Queue routes
app.get('/getQueue', getQueues);
app.post('/enterQueue', FBAuth, enterQueue);

// Signup route
app.post('/signup', signup);

// login route
app.post('/login', login);

exports.api = functions.https.onRequest(app);
