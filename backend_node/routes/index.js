let express = require('express');

let router = express.Router();

// Import Most Popular Users Controller
let homeController = require('../controllers/homeController');
let mostPopularUsersController = require('../controllers/mostPopularUsersController');
let mostPopularProjectsController = require('../controllers/mostPopularProjectsController');
// let languageWiseProject = require('../controllers/languageWiseProject');
let registerController = require('../controllers/registerController');
let yearWiseLanguage = require('../controllers/yearWiseLanguagePopularity');
let countryByUsers = require('../controllers/userByCountryController');


// GET home page.
router.get('/', homeController.index);

// API Routes
router.get('/api/users', mostPopularUsersController.getMostPopularUsers);
router.get('/api/projects', mostPopularProjectsController.getMostPopularProjects);
router.get('/api/languages', yearWiseLanguage.getLanguagePopularity);
router.get('/api/country', countryByUsers.getUsersByCountry);
router.post('/api/popular-users', mostPopularUsersController.getUserByCountry);

// Register Page
router.get('/register', registerController.index);
router.post('/register', function(req, res, next) {

   const Admin = require('../models/Admin');
   let data = {
      first_name: req.body.fname,
      last_name: req.body.lname,

      address: req.body.address1,
      city: "",
      state: req.body.state,
      zipcode: req.body.zip,

      phone: req.body.phone,
      email: req.body.email,

      password: req.body.psw,
   }

   let user = new Admin;

   for(const field in data) {
      user[field] = data[field];
   }

   user.save(function (err, b) {

      if (err) {

         res.render('submittedData', { data: { error: err, 'success': false } });
      }

      if (b) {

         res.render('submittedData', { data :  b} );

      }

   });

   // sample tests
   // res.render('submittedData', {
   //    data: {
   //       "_id": "5cc82fddb7be9c89871f7ec4",
   //       "created_at": "2019-04-30T11:22:05.496Z",
   //       "first_name": "df",
   //       "last_name": "sdf",
   //       "address": "Colonnade Apartments, 201 S 4th St, #720",
   //       "city": "",
   //       "state": "California",
   //       "zipcode": "95112",
   //       "phone": "666-666-6666",
   //       "email": "abhin.sharma25@gmail.com",
   //       "password": "123",
   //       "id": 0,
   //       "__v": 0
   //    } });
});


router.get('/login', registerController.login);
router.post('/login', function (req, res, next) {

   const Admin = require('../models/Admin');
   let data = {
      email: req.body.email,
      password: req.body.psw,
   }

   Admin.where(data)
      .findOne()
      .exec(function (err, user) {

         if (user) {

            req.session.user = user;
            req.session.save();
            res.redirect('/');
            res.end();
         } else {
            res.render('login', { data: { error: err, 'success': false } });
         }


      });

});


router.get('/logout', registerController.logout);

//Dashboard Routes
router.get('/popular-users', mostPopularUsersController.index);
router.get('/top-languages', yearWiseLanguage.index);
router.get('/popular-projects', mostPopularProjectsController.index)
router.get('/user/:id', mostPopularUsersController.getUser)





module.exports = router;
