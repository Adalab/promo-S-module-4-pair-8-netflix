const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const actorsSchema = new Schema(
  {
    name: String,
    lastname: String,
    country: String,
    birthday: String,
  },
  { collection: 'actors' }
);
const Actors = mongoose.model('actors', actorsSchema);
module.exports = Actors;