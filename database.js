
const mongoose = require('mongoose');

const connectDatabase =( mongoose.connect('mongodb://localhost:27017/User'), console.log("db connected"))
module.exports =  connectDatabase;
