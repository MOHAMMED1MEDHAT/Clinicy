const Ajv=require('ajv');
const ajv=new Ajv();

const schema={
    "type":"object",
    "properties":{
        // "patient":{
        //     "type":"string",
        //     // "pattern":"^[A-Z][a-z]*$"
        // },
        "appointmentId":{
            "type":"string",
        },
        "typeOfNotification":{
            "type":"string",
        },
    },
    "required":["appointmentId","typeOfNotification"]
}


module.exports=ajv.compile(schema);