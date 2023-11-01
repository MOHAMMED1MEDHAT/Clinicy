const validator = require("../util/profileUpdateValidator");

module.exports = (req, res, nxt) => {
    let valid = validator(req.body);
    if (valid) {
        nxt();
    } else {
        res.status(403).send("forbidden comand");
    }
};
