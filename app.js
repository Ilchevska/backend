const { MongoClient, ObjectID } = require("mongodb");
const express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const {request, response} = require("express");
var path = require('path');


const client = new MongoClient("mongodb+srv://m001-student:m001-mongodb-basics@twilio.ex8eh.azure.mongodb.net/twilio?retryWrites=true&w=majority");
const server = express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({extended: true}));
server.use(Cors());
server.set('view engine', 'ejs')

var collection;

server.use(express.static(__dirname, {index: 'login.html'}));
server.use('/assets', express.static('assets'));

server.get('/', function (req, res) {
    res.sendFile('/login.html', {root: path.join(__dirname, '../index')});
});

server.get("/search", async (request, response) =>  {
    try {
        let result = await collection.aggregate([
            {
                "$search": {
                    "autocomplete":{
                        "query": `${request.query.citID}`,
                        "path": "citID",
                    }
                },

            }
        ]).toArray();
        response.send(result);

    } catch (e) {
        response.status(500).send({ message: e.message });
    }
});

server.get("/get/:id", async (request, response) => {
    try {
        let result = await collection.findOne({ "_id": ObjectID(request.params.id)});
        response.send(result);
    } catch (e) {
        response.status(500).send({ message: e.message});
    }
})

server.put('/update/:id', async (request, response) => {

    try {
        let data = request.body;
        let id = request.params.id;

        client.connect(function (err, db) {
            if (err) throw err;
            collection.updateOne({"_id": ObjectID(id)}, { $set: data }, function (err, result) {
            db.close(); 
        })
    })
    }catch (e) {

    }
})

// server.post('/index', async (request,response) => {
    
// })

const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
    try {
        await client.connect();
        collection = client.db("twilio").collection("applicantDetails");
    } catch (e) {
        console.error(e);
    }
})

