// const axios = require('axios');

// module.exports.index = function (req, res, next) {
//     axios.get('https://api.github.com/search/repositories?q=language&page=1&per_page=100')
//         .then(function(response) {
//             if (response.status >= 200 && response.status < 400) {
//                 res.status(response.status).json(response.data.items);
//             } else {
//                 throw new Error('Internal Server Error');
//             }
//         })
//         .catch(function(error) {
//             console.log(error);
//         })
// };