const express = require("express");
const { MongoClient } = require('mongodb');
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
        // console.log("database connected");
        

        //Get Ride API
        app.get("/rides", async(req, res) => {
            const cursor = rideCollection.find({});
            const rides = await cursor.toArray();
            res.send(rides);
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