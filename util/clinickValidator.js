const Ajv=require('ajv');
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        "doctor":{
            "type":"string",
            // "pattern":"^[A-Z][a-z]*$"
        },
        "clinicName":{
            "type":"string"
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
        "OpenDates": {
            "type": "object",
            "properties": {
                "days": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "time": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
        },
        "rating":{
            "type":"string"
        },
        "about":{
            "type":"string"
        }
    },
    "required":["phone","clinicName","location","specialization","price","openDates","about"]
}


module.exports=ajv.compile(schema);