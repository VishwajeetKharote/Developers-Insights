module.exports.index = function(req, res, next) {
  res.render('register');
};

module.exports.canvas = function(req, res, next) {
  res.render('canvas');
};

module.exports.form = function (req, res, next) {
   res.render('form');
};

module.exports.login = function (req, res, next) {
   res.render('login', { data: { error : "" } });
};

module.exports.logout = function (req, res, next) {

   req.session.destroy();

   res.render('login', { data: { error: "" } });
};
