const {MongoClient, Admin, ObjectId} = require("mongodb")
const libRandomString = require("randomstring")
const libExpress = require("express")
const cors = require("cors")
const server = libExpress()
server.use(cors())
server.use(libExpress.json()) //converts into json format

const connection = new MongoClient("mongodb://ims_u:ims_u1104@localhost:27017/IMS?authSource=IMS")

//user signup
server.post("/users", async (req, res)=>{
    //console.log("user request")

    if(req.body.name && req.body.email && req.body.password && req.body.phone){
        await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("users")
        const result = await collection.find({"email": req.body.email}).toArray()

        if(result.length > 0)
            res.json("User already exist!")

        else{
            await collection.insertOne({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone
            })
            res.json("User created successfully!")
        }connection.close()

    } 
    else{
        res.json("Please fill all the fields!")
    }



    /*
    if(req.body.name && req.body.email && req.body.password && req.body.phone){
    connection.connect().
    then(() => connection.db("IMS")).
    then((db) => db.collection("USER")).
    then((collection) => collection.insertOne({
        name: req.body.name,
        email: req.body.email,
        passwoed: req.body.password,
        phone: req.body.phone
    })).
    then(() => res.json({message: "User created successfully"})).
    catch((error) => res.json({message: "Error creating user ", error}))
    }
    */
})

//user login
server.post("/token", async (req, res)=>{
    console.log("user request")

    if(req.body.email && req.body.password){
        await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("users")
        const result = await collection.find({"email": req.body.email, "password": req.body.password}).toArray()
        
        if(result.length > 0)
        {
            // genetare token
            const generatedToken = libRandomString.generate(6)

            // register token against user
            const user = result[0]
            
            await collection.updateOne(
                { _id: user._id },
                {$set: {token: generatedToken}}
            )

            // return token to user
            res.status(200).json({token: generatedToken})
        }
        else{
            res.status(400).json({message: "Invalid email or password"})
        }connection.close()
    }

    else{
        res.status(401).json({message: "All fields are required"})
    }

})


// user role
server.get("/users/role", async (req, res) =>{
    console.log("user role request")

    if(req.headers.token){
        
        await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("users")
        const result = await collection.find({"token": req.headers.token}).toArray()

        if(result.length > 0)
        {
            const user = result[0]

            const roles = {
                admin: user.is_admin === true,
                owner: !!user.owner_of,
                player: !!user.playing_for
            }

            res.status(200).json(roles)
        }

        else{
            res.status(401).json({message: "Invalid token"})
        }connection.close()
        
    }
    else{
        res.status(401).json({message: "Unauthorized"})
    }
})

//Player's info
server.get("/players", async(req, res)=>{
    console.log("player req")
     await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("users")
        const result = await collection.find({"playing_for":{$exists:true}}).toArray()
        res.status(200).json(result)
       
})


    server.get("/team", async(req, res)=>{
    console.log("team req")
     await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("team")
        const result = await collection.find().toArray()
        res.status(200).json(result)
})
server.get("players/:id/state",async (req,res)=>{
    if(req.params.id){
        await connection.connect()
        const db = await connection.db("IMS")
        const collection = await db.collection("users")
        const result = await collection.findOne({"_id": new ObjectId(req.params.id)})
        res.status(200).json(result)
        connection.close()
    }


    
})

server.listen(8001, ()=> {
    console.log("Server is running on port 8001")
})

