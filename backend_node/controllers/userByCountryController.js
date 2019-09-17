const Country = require('../models/Country');

module.exports.getUsersByCountry = function (req, res, next) {
    Country.find().then((response) => {
        res.status(200).json(response);
    })
};

module.exports.index = function (req, res, next) {
    res.render('users-area');
};
