const mongoose = require("mongoose")

const connect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_DB)
        console.log("Connection is successfull");

    } catch (error) {
        console.log("Error in connection", error.message);

    }
}

module.exports = connect;