const path = require('path');

module.exports.index = function (req, res, next) {


   if (!req.session.user)
      res.redirect('/login');
   else {

      if (!req.session.user['first_name'])
         req.session.user['first_name'] = 'NoBody';

      res.render('index', { user: req.session.user });
   }
};
