const libExpress = require("express")
const cors = require("cors")
const server = libExpress()
server.use(cors())
server.use(libExpress.json())
const { MongoClient } = require("mongodb")
 const connection = new MongoClient("mongodb://ims_u:ims_u1104@localhost:27017/IMS?authSource=IMS")
const DB="IMS"
server.post("/users", async (req, res) => {
  if(req.body.name && req.body.email && req.body.password && req.body.phone){
       await connection.connect()
       const db= await connection.db(DB)
       const result=await db.collection("users")
       if(result.length>0){
        res.json("error: User Already Have An Account")
       }
     
      
  }
  else{
   await collection.insertOne({
    name:res.body.name,
    email:res.body.email,
   password:res.body.pasword,
   phone:res.body.phone
  
   },res.json("User Created")
  
   

   )
  }
})
/*server.post("/players", (req, res) => {
    console.log("received Request")
    res.send("Player Created")

})
server.post("/team", (req, res) => {
    console.log("received Request")
    res.send("Team Created")

})


/*server.get(("/users"), (req, res) => {
    res.json(
        [
            {
                name: "Trushti"
            },
            {
                name: "Krishna"
            },
            {
                name: "Madhavi"
            }
        ]
        
    )
})*/
server.post("/users", async (req, res) => {
   
    connection.connect().then(() => connection.db(DB)).
    then((db) => db.collection("users")).
    then((collection) => collection.find().toArray()).
    then((result) => console.log(result)).
    catch((error) => console.log(error))

})


server.listen(8000, () => {
    console.log("server listen over 8000")
})