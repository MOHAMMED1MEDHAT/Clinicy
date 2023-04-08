const Ajv=require('ajv');
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "patient":{
            "type":"string",
            // "pattern":"^[A-Z][a-z]*$"
        },
        "clinick":{
            "type":"string",
        },
        "appointmentDate":{
            "type":"string",
        },
        "report":{
            "type":"string"
        },
        "bookingTime":{
            "type":"string"
        },
        "status":{
            "type":"string"
        },
        "rating":{
            "type":"string"
        }
    },
    "required":["patient","clinick","appointmentDate","bookingTime"]
}


module.exports=ajv.compile(schema);