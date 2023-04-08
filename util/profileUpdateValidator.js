const Ajv=require('ajv');
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "name":{
            "type":"string",
            // "pattern":"^[A-Z][a-z]*$"
        },
        "email":{
            "type":"string",
            "pattern":".+\@.+\.."
        },
        "imageUrl":{
            "type":"string"
        }
    },
    "required":["name","imageUrl"]
}


module.exports=ajv.compile(schema);