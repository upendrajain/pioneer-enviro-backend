/**
 * stateSchema function use for store state data
 * @since 06/06/2024
 */
const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema({
    name: {type: String},
    state_code: {type: String},
    country_id: {type: mongoose.Schema.Types.ObjectId, ref:'country', index: true},
    status: { type: Boolean },
//    id: { type: String, index: true },
    gst_code: { type: String, index: true },
})
module.exports = mongoose.model('state', stateSchema)
