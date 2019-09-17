const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');


autoIncrement.initialize(mongoose.connection);

mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;


const userSchema = new Schema({

   id: { type: Number, default: 0 },
   first_name: String,
   last_name: String,

   address: String,
   city: String,
   state: String,
   zipcode: String,

   phone: String,
   email: String,

   password: String,
   created_at: { type: Date, default: Date.now },


});



userSchema.plugin(autoIncrement.plugin, { model: 'AdminUser', field: 'id' });


const AdminUser = mongoose.model('AdminUser', userSchema);


module.exports = AdminUser;
