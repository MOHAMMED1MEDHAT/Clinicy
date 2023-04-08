const Ajv=require('ajv');
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "email":{
            "type":"string",
            "pattern":".+\@.+\.."
        },
        "password":{
            "type":"string",
            "minLength":5
        },
        "type":{
            "type":"string"
        },
    },
    "required":["email","password","type"]
}


module.exports=ajv.compile(schema);