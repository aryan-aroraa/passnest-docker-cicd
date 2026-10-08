const express = require('express')
const dotenv = require('dotenv').config()
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
var cors = require('cors')

const app = express()
const port = 3000

app.use(bodyParser.json())
app.use(cors())

const url = 'mongodb://mongo:27017';
const client = new MongoClient(url);
const dbName = 'passnest';

client.connect();

// get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// save passwords
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.insertOne(password)
    res.send({ success: true, result: findResult })
})

// delete passwords
app.delete('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName)
    const collection = db.collection('passwords')
    const findResult = await collection.deleteOne(password)
    res.send({ success: true, result: findResult })
})

app.listen(port, () => {
    console.log(`Example app listening on http://localhost:${port}/`)
})
