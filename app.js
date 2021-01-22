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

/* server.use((req, res, next) => {
    console.log(req.headers)
    res.header('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Methods", "POST,PUT");
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    print ( "Access-Control-Allow-Origin: *\n");
print ("Access-Control-Allow-Headers: X-Requested-With, Content-Type\n");
    next();
  });  */

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
//   response.setheader['X-Requested-With'] = 'xmlhttprequest'
//    request.header("X-Requested-With", "XMLHttpRequest");

    try {
        let data = request.body;
        var id = request.params.id;
        console.log(id);
        client.connect(function (err, db) {
            if (err) throw err;
            collection.updateOne({"_id": ObjectID(id)}, { $set: data }, function (err, result) {
                if (err) {
                    console.log(id);
                    throw err;
                } else {
                console.log("Items updated");
                db.close(); 
                }
            })
        })
/*         client.connect(function (err, db) {
            if (err) throw err;
            collection("applicantDetails").updateOne({"_id": ObjectID(id)}, { $set: data }, function (err, result) {
                console.log("Items updated");
                db.close(); 
        })*/
    }catch (e) {

    }
})

    // let result = await collection.findOne({ "_id": ObjectID(id)});
    // response.send(result);
 

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

