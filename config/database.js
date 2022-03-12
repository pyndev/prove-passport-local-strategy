const mongoose = require('mongoose');

require('dotenv').config();

const conn = process.env.MONGO_LOCAL;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

if (connection) {
    console.log("DB Connect successfully..")
}

//Create simple shema
const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    salt: String,
    admin: Boolean
});

const User = connection.model('User', UserSchema);

module.exports = connection;