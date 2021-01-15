const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const {request, response} = require("express");

const client = new MongoClient("mongodb+srv://m001-student:m001-mongodb-basics@twilio.ex8eh.azure.mongodb.net/twilio?retryWrites=true&w=majority");
const server = Express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({extended: true}));
server.use(Cors());
server.set('view engine', 'ejs')

var collection;


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

    var id = request.params.id;

    client.connect(function (err, db) {
        if (err) throw err;
        db.collection("applicantDetails").updateOne({ "_id": id }, { $set: {applicationStatus: status.value} }, function (err, result) {
            assert.equal(null, err);
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

var port = process.env.port || 3000;
server.listen(port, async () => {
    try {
        await client.connect();
        collection = client.db("twilio").collection("applicantDetails");
    } catch (e) {
        console.error(e);
    }
})