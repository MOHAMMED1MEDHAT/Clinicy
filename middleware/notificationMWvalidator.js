// const validator=require("../util/notificationValidator");

// module.exports=(req,res,nxt)=>{
//     let valid=validator(req.body);
//     if(valid){
//         nxt();
//     }else{
//         //test-----
//         console.log(req.body);
//         res.status(403).send("forbidden comand");
//     }
// }