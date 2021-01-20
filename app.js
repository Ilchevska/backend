const { MongoClient, ObjectID } = require("mongodb");
const express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const {request, response} = require("express");

const client = new MongoClient("mongodb+srv://m001-student:m001-mongodb-basics@twilio.ex8eh.azure.mongodb.net/twilio?retryWrites=true&w=majority");
const server = express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({extended: true}));
server.use(Cors());
server.set('view engine', 'ejs')

var collection;

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
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

server.put("/update/:id", async (request, response) => {
    const data = req.body;
    var id = req.params.id;
    console.log(id);
    client.connect(function (err, db) {
        if (err) throw err;
        db.collection("applicantDetails").updateOne(id, { $set: data }, function (err, result) {
            console.log("Items updated");
            db.close();
    })

})
  

    // let result = await collection.findOne({ "_id": ObjectID(id)});
    // response.send(result);
 })

/* server.get("/applicant_details", async (request, response) => {
        const db = client.db("twilio");
        const collection = db.collection("applicantDetails");
        collection.findOne({ "_id": ObjectID(request.params.id)})
        if (details) {
            var applicantName = details.firstName;
            response.send(applicantName);
        }
}) */

const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
    try {
        console.log(`Server is listening on port...`)
        await client.connect();
        collection = client.db("twilio").collection("applicantDetails");
    } catch (e) {
        console.error(e);
    }
})