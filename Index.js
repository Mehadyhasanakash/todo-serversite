const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
var cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080

require('dotenv').config()



app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjk0q.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log(uri)

async function run() {
    try {
        await client.connect();
        const serviceCollection = client.db('todo-list').collection('service')




        app.get('/user', async (req, res) => {
            const query = {}
            const cousor = serviceCollection.find();
            const users = await cousor.toArray()
            res.send(users)
        });


        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.findOne(query);
            res.send(result);
        });

        app.put('user/:id', async (req,res) =>{
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: ObjectId(id)};
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name:update.name
                }
              };
              const result = await serviceCollection.updateOne(filter, updateDoc, options);
              res.send(result);


        });



        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('add a new user', newUser)
            const result = await serviceCollection.insertOne(newUser);
            res.send(result)
        });



    }

    finally {
        // await client.close();
    }
}
run().catch(console.dir);







app.get('/', (req, res) => {
    res.send('Hello World!')
})







app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})