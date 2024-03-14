const mongoose = require('mongoose');
const Appliance = mongoose.model('Appliance', new mongoose.Schema({
  key: {type:String},
  brands: {type:Array}
}));

module.exports = Appliance;