const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const configurePassport = require('./config/passport');
const authRouter = require('./routes/auth');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

let db;

configurePassport(() => db);

app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('TravelWise server running');
});

app.get('/api/destinations', (req, res) => {
  db.collection('destinations')
    .find()
    .toArray()
    .then((destinations) => res.json(destinations))
    .catch((err) => res.status(500).send(err));
});

app.get('/api/trips', (req, res) => {
  db.collection('trips')
    .find()
    .toArray()
    .then((trips) => res.json(trips))
    .catch((err) => res.status(500).send(err));
});

app.post('/api/trips', (req, res) => {
  const trip = {
    name: req.body.name,
    dates: req.body.dates,
    description: req.body.description,
    image: req.body.image || '',
    status: req.body.status || 'upcoming',
  };

  db.collection('trips')
    .insertOne(trip)
    .then((result) => {
      res.json({ _id: result.insertedId, ...trip });
    })
    .catch((err) => res.status(500).send(err));
});

app.put('/api/trips/:id', (req, res) => {
  const update = {};
  if (req.body.name !== undefined) update.name = req.body.name;
  if (req.body.dates !== undefined) update.dates = req.body.dates;
  if (req.body.description !== undefined) update.description = req.body.description;
  if (req.body.image !== undefined) update.image = req.body.image;
  if (req.body.status !== undefined) update.status = req.body.status;

  db.collection('trips')
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: update })
    .then(() => res.json({ _id: req.params.id, ...update }))
    .catch((err) => res.status(500).send(err));
});

app.delete('/api/trips/:id', (req, res) => {
  db.collection('trips')
    .deleteOne({ _id: new ObjectId(req.params.id) })
    .then(() => res.json({ deleted: req.params.id }))
    .catch((err) => res.status(500).send(err));
});

MongoClient.connect(process.env.MONGO_URI)
  .then((client) => {
    db = client.db();
    app.locals.db = db;
    console.log('connected to mongodb');

    app.listen(port, () => {
      console.log('server running on port ' + port);
    });
  })
  .catch((err) => {
    console.log('could not connect to mongodb');
    console.log(err);
  });
