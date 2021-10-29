const express = require("express");
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h6t6k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db("theme_park");
        const rideCollection = database.collection("rides");
        const ordersCollection = database.collection("bookings");
        // console.log("database connected");
        

        //Get Ride API
        app.get("/rides", async(req, res) => {
            const cursor = rideCollection.find({});
            const rides = await cursor.toArray();
            res.send(rides);
        })

        

        //Get Single API
        app.get("/rides/:id", async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await rideCollection.findOne(query);
            res.json(result);
        })


        //Bookings POST API
        app.post("/bookings", async(req, res) => {
            const booking = req.body;
            console.log("hit the post api", booking);
            const result = await ordersCollection.insertOne(booking);
            console.log(result);
            res.json(result)
        })

        //Bookings GET API

        app.get("/bookings", async(req, res) => {
            const cursor = ordersCollection.find({});
            const booking = await cursor.toArray();
            res.send(booking)
        })

        app.get("/check", async(req, res) => {
            console.log("checked");
            res.send("this check is running");
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);



app.get("/", (req, res) => {
    res.send("Server is running well");
})

app.listen(port, () => {
    console.log("listening from: ", port);
})