const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// password - n9HxQvPfCqJsL725
// user - mission_crud

const uri =
  "mongodb+srv://mission_crud:n9HxQvPfCqJsL725@cluster0.lgiglma.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("missionNodeDb").collection("users");

    app.get("/users", async (req, res) => {
      let cursor = database.find();
      let result = await cursor.toArray();
      res.send(result);
    });

    app.get("/users/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) };
      let result = await database.findOne(query);
      res.send(result);
    });

    app.post("/users", async (req, res) => {
      let user = req.body;
      let result = await database.insertOne(user);
      res.send(result);
      console.log(result);
    });

    app.put("/users/:id", async (req, res) => {
      let id = req.params.id;
      let user = req.body;
      let cursor = { _id: new ObjectId(id) };
      let options = { upsert: true };
      let UserDoc = {
        $set: {
          name: user.name,
          email: user.email,
        },
      };
      let result = await database.updateOne(cursor, UserDoc, options);
      res.send(result);
      console.log(result);
    });

    app.delete("/users/:id", async (req, res) => {
      let id = req.params.id;
      let query = { _id: new ObjectId(id) };
      let result = await database.deleteOne(query);
      res.send(result);
      console.log(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Data is cooming sooon");
});

app.listen(port, () => {
  console.log(`Server is running in port of ${port}`);
});
