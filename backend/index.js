const express = require ('express')
const cors =require('cors')
const app = express();
const port =6001;
app.use (cors());
app.use(express.json())


const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');
const uri = "mongodb+srv://praviipravii7:LSQdy00UM8vtFx4Z@cluster0.qpvyubh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const dolls=client.db("Studentslist").collection("studentdata");

    app.post("/upload",async(req,res)=>{
        const data=req.body;
        const result=await dolls.insertOne(data);
        res.send(result);
    })
    
    
    app.get("/sns",async(req,res)=>{
        const foods=dolls.find();
        const result=await foods.toArray();
        res.send(result);
    })

    app.get("/snsbyid/:id",async(req,res)=>{
      const id=req.params.id;
      const filter={_id:new ObjectId(id)};
      const result=await dolls.findOne(filter);
      res.send(result);
    })
    
    app.patch("/allproductsnacks/:id",async(req,res)=>{
      
        const id=req.params.id;
        
  const updateFooddata = { ...req.body };
  delete updateFooddata._id;

        const filter={_id:new ObjectId(id)};

        const updateDoc={
            $set:{
                ...updateFooddata
            },
        }
        const options ={upsert:true};

        const result=await dolls.updateOne(filter,updateDoc,options);
        res.send(result);
    })

    app.delete('/deletesnack/:id',async(req,res)=>{
        const id=req.params.id;
        console.log(id)
        const filter={_id:new ObjectId(id)};
        const result=await dolls.deleteOne(filter);
        res.status(200).json({success:true , message:"data deleted successfully", result});
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen (port, ()=>{
    console.log(`conected to ${port}`)
}
)


