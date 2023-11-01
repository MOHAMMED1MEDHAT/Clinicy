const validator = require("../util/authValidator");

module.exports = (req, res, nxt) => {
    //test--------
    console.log(req.body);
    let valid = validator(req.body);
    if (valid) {
        nxt();
    } else {
        //test-------
        console.log(req.body);
        //-----------
        res.status(403).send("forbidden comand");
    }
};
