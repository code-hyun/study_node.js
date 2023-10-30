// 몽구스 스키마 만들기

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const personSchema = new Schema({
    name : String,
    age : Number,
    email : {type : String, required : true},
});

module.exports = mongoose.model('Person', personSchema);
