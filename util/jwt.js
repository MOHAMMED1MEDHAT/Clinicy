const authj=require("express-jwt");
const config=require("config");
const jwtSCRT=config.get("env_var.jwtScreteKey");

function auth(){
    return authj({
        secret:jwtSCRT,
        algorithms:["HS256"],
        isRevoked: isRevoked
    }).unless({
        path:[
            "/api/user/signUp",
            "/api/user/login",
        ]
    });
}

async function isRevoked(req,payload,done){
    if(!payload.isAdmin){
        done(null,true)
        //test------------------------------
        console.log("isRevoked")
    }
    done()
}

module.exports=auth