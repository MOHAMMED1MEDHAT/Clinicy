const userRouter=require("./routes/user")
const authRouter=require("./routes/auth")
const searchRouter=require("./routes/search")
const profileRouter=require("./routes/profile")
// const mainPageRouter=require("./routes/mainpage")
const appointmentRouter=require("./routes/appointment")
const clinickRouter=require("./routes/clinick")

const mongoose=require("mongoose");
// const bodyParser=require("body-parser")
const express=require("express");
const app=express();

//test---------------
// const { MongoClient } = require("mongodb");

// // Replace the following with your Atlas connection string
// const url = "mongodb+srv://admin:5eDunuda0guvOPST@cluster0.w82mk22.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(url);

// async function run() {
//     try {
//         await client.connect();
//         console.log("Connected correctly to server");

//     } catch (err) {
//         console.log(err.stack);
//     }
//     finally {
//         await client.close();
//     }
// }
// run().catch(console.dir);
//-------------------


process.on("uncaughtException",(exception)=>{console.log("uncaught Exception");});
process.on("unhandledRejection",(exception)=>{console.log("uncaught async Exception");});

mongoose.connect("mongodb://127.0.0.1:27017/clinicky").then(()=>{
    console.log('Connected to db');
}).catch((err) => console.log("error occured"));
//mongodb+srv://admin:5eDunuda0guvOPST@cluster0.w82mk22.mongodb.net/?retryWrites=true&w=majority
//mongodb://127.0.0.1:27017/clinicky

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/api/user/signUp",userRouter);//test done
app.use("/api/user",authRouter);//test done
app.use("/api/search",searchRouter);//test done
app.use("/api/profile",profileRouter);//test done
// app.use("/api/mainPage",mainPageRouter);
app.use("/api/appointments",appointmentRouter);
app.use("/api/clinicks",clinickRouter);//test done

const port=process.env.PORT||4000;
app.listen(port,()=>{console.log("listening ....!!! on port "+port)});
