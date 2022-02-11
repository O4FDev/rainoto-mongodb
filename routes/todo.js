const express = require('express');
const ObjectId = require('mongodb').ObjectID;
// todoRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /listings.
const todoRoutes = express.Router();

// This will help us connect to the database
const dbo = require('../db/conn');

// This section will help you get a list of all the records.
todoRoutes.route('/todos').get(async function (_req, res) {
  const dbConnect = dbo.getDb();

  dbConnect
    .collection('todos')
    .find({})
    .limit(50)
    .toArray(function (err, result) {
      if (err) {
        res.status(400).send('Error fetching listings!');
      } else {
        res.json(result);
      }
    });
});

// This section will help you create a new record.
todoRoutes.route('/todos').post(function (req, res) {
    const dbConnect = dbo.getDb();
    const { username, body, completed, dateBy, date, pet } = req.body;

    const todoDocument = {
        username,
        body,
        completed,
        dateBy,
        date,
        pet,
    };

    dbConnect
    .collection('todos')
    .insertOne(todoDocument, function (err, result) {
        if (err) {
            res.status(400).send('Error inserting todos!');
        } else {
            console.log(`Added a new todo with id ${result.insertedId}`);
            res.status(204).send();
        }
    });
});

// A route to change 'completed' status of a todo.
todoRoutes.route('/todos/:id').put(function (req, res) {
    const dbConnect = dbo.getDb();
    const { id } = req.params;
    const { completed } = req.body;

    dbConnect
    .collection('todos')
    .updateOne({ "_id": ObjectId(id) }, { $set: { completed: completed } }, function (err, result) {
        if (err) {
            res.status(400).send('Error updating todos!');
        } else {
            console.log(`Updated todo with id ${id}`);
            res.status(204).send();
        }
    });
});

todoRoutes.route('/todos/:id').delete(function (req, res) {
    const dbConnect = dbo.getDb();
    const { id } = req.params;

    dbConnect
    .collection('todos')
    .deleteOne({ "_id": ObjectId(id) }, function (err, result) {
        if (err) {
            res.status(400).send('Error deleting todos!');
        } else {
            console.log(`Deleted todo with id ${id}`);
            res.status(204).send();
        }
    });
});

module.exports = todoRoutes;
