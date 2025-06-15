/**
 * zoneSchema function use for store zone data
 * @since 06/06/2024
 */
const mongoose = require("mongoose");

const citySchema = new mongoose.Schema({
    name: {type: String, index: "text"}, //
    sort_no: {type: Number, index: true},
    uni_code: {type: String},
    description: {type: String},
    meta_title: {type: String},
    meta_description: {type: String},
    meta_keyword: {type: String},
    meta_image: {
        public_id: { type: String },
        url: String
    },
    state_id: {  type: mongoose.Schema.Types.ObjectId, ref: 'state', index: true },
    country_id: { type: Number, index: true },
    is_active: {type: Boolean, default:true},
},
{
    timestamps: true
})

module.exports = mongoose.model('city', citySchema)

