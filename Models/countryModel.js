/**
 * countrySchema function use for store country
 * @since 06/06/2024
 */
const mongoose = require("mongoose");
const countrySchema = new mongoose.Schema({
  name: { type: String },
  code: { type: String },
  status: { type: Boolean },
  iso3: { type: String },
  iso2: { type: String },
  phone_code: { type: String },
  currency: { type: String },
  currency_symbol: { type: String },
  region: { type: String },
  latitude: { type: String },
  longitude: { type: String },
  id: { type: String, index: true },
});

module.exports = mongoose.model("country", countrySchema);
