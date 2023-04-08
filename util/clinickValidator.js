const Ajv=require('ajv');
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "doctor":{
            "type":"string",
            // "pattern":"^[A-Z][a-z]*$"
        },
        "phone":{
            "type":"string",
        },
        "location":{
            "type":"string",
        },
        "specialization":{
            "type":"string"
        },
        "price":{
            "type":"string"
        },
        "openDates":{
            "type":"string"
        },
        "rating":{
            "type":"string"
        }
    },
    "required":["phone","location","specialization","price","openDates"]
}


module.exports=ajv.compile(schema);