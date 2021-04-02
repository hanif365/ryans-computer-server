const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
// const { ObjectID } = require('bson');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cwfp8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express()

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


const port = 5000;


// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://<username>:<password>@cluster0.cwfp8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection error : ', err);
    const productsCollection = client.db("ryansComputerStore").collection("products");
    const ordersCollection = client.db("ryansComputerStore").collection("orders");
    console.log('DB connected')

    app.get('/products', (req, res) => {
        productsCollection.find()
            .toArray((err, products) => {
                res.send(products)
                // console.log('From database', products);
            })
    })


    // challenge
    app.get('/products/:id', (req, res) => {
        console.log(req.params.id)
        productsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, products) => {

                res.send(products)
                console.log('From database', products);
            })
    })


// delete korte hobe
    app.get('/products', (req, res) => {
        productsCollection.find()
            .toArray((err, products) => {
                res.send(products)
                // console.log('From database', products);
            })
    })


    app.get('/orders', (req, res) => {
        console.log(req.query.email);
        ordersCollection.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    
    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        console.log('adding new product', newProduct)
        productsCollection.insertOne(newProduct)
            .then(result => {
                console.log('Inserted Count : ', result.insertedCount);
                // res.send(result.insertedCount > 0)
                // new added

                res.send('Success');
                // res.redirect('/');
            })
    })

    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result);
            })
    })

    // New code for order

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body;
        console.log('adding new product', newOrder)
        ordersCollection.insertOne(newOrder)
            .then(result => {
                console.log('Inserted Count : ', result.insertedCount);
                res.send(result.insertedCount > 0)
                // new added

                // res.send('Success');
                // res.redirect('/');
            })
    })


    // app.delete('/delete/:id', (req, res) => {
    //     const id = ObjectID(req.params.id);
    //     console.log('Delete this', id);
    //     productsCollection.findOneAndDelete({ _id: id })
    //         .then(documents => res.send(!!documents.value))
    // })
    //   client.close();
});


app.listen(process.env.PORT || port)