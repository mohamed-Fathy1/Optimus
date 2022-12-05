const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, trim: true },
    date: { type: Date, required: true, trim: true },
    
})

const exercise = mongoose.model('exercise',exerciseSchema)

module.exports = exercise;