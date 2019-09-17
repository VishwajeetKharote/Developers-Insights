const axios = require('axios');

module.exports.getMostPopularProjects = function (req, res, next) {
    axios.get('https://api.github.com/search/repositories?q=stars:%3E1&sort=stars')
        .then(function(response) {
            if (response.status >= 200 && response.status < 400) {
                res.status(response.status).json(response.data.items);
            } else {
                throw new Error('Internal Server Error');
            }
        })
        .catch(function(error) {
            console.log(error);
        })
};


module.exports.index = function (req, res, next) {

   if (!req.session.user)
      res.redirect('/login');
   else {

      if (!req.session.user['first_name'])
         req.session.user['first_name'] = 'NoBody';

      res.render('popular-projects', { user: req.session.user });
   }

};
