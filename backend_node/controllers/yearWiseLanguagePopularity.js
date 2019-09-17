const axios = require('axios');
const Language = require('../models/Language');
const mongoose = require('mongoose');

module.exports.getLanguagePopularity = function (req, res, next) {
    Language.find({}, 'data', function (err, languages) {
        if (err) {
            console.log(err);
        } else {
            let responseArray = [];
            for (let i = 0; i < languages.length; i++) {
                responseArray.push(languages[i].data[0]);
            }
            res.status(200).json({ data: responseArray });
        }
    });
};


module.exports.index = function (req, res, next) {

   if (!req.session.user)
      res.redirect('/login');
   else {

      if (!req.session.user['first_name'])
         req.session.user['first_name'] = 'NoBody';

      res.render('top-languages', { user: req.session.user });
   }

};
