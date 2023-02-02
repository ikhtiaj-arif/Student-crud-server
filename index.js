const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5000


// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is running...')
})


const uri = process.env.DB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{ 
        const studentsCollection = client.db('Task').collection('students')
        // get all students
        app.get('/students',  async(req, res)=> {
            const query = {role: null};
            const result = await studentsCollection.find(query).toArray();
            res.send(result)
        })

        // get student by id
        app.get('/students/:id',  async(req, res)=>{
            const id = req.params.id;
            console.log("id",id)
            const filter = { _id: new ObjectId(id) };
            const result = await studentsCollection.findOne(filter)
            res.send(result)
        })

        // post students
        app.post('/student', async(req, res)=>{
            const product = req.body;
            console.log(req.body);
            const result = await studentsCollection.insertOne(product);
            res.send(result)
        })

        // update student by id
        app.put('/students', async(req, res)=> {
            const id = req.params.id;

            const filter ={_id : ObjectId(id) }
            const update = req.body;
            const option = { upsert: true }
            const updatedDoc = {
                $set: update 
            } 
            const result = await studentsCollection.updateMany(filter, updatedDoc, option);
            console.log(result);
            res.send(result)
        })


        // delete student
        app.delete('/student/:id',  async(req, res)=>{
            const id = req.params.id;
            const filter = { _id : ObjectId(id)}
            const result = await studentsCollection.deleteOne(filter)
            res.send(result)
        })

       }
    finally{

    }
}
run().catch(e => console.dir(e))















app.listen(port, () => {
    console.log(`Server is running...on ${port}`)
  })
  