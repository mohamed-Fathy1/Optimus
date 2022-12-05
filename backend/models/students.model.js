const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const studentSchema = new Schema({
    id:
    {
        type: Number,
        required: true,
        unique: true,
        trim: true
    },
    name:
    {
        type: String,
        required: true,
        trim: true
    },
    username:
    {
        type: String,
        required: true,
        trim: true
    },
    password:
    {
        type: String,
        required: true,
        trim: true
    },
    level:
    {
        type: Number,
        required: true,
        trim: true
    },
    last_visit:
    {
        type: Date,
        required: true,
        trim: true
    },
    courses:
    {
        type: Array,
        required: true,
        trim: true
    },
    overall_grade:
    {
        type: String,
        trim: true
    },
},{timestamps: true})

const student = mongoose.model('student', studentSchema)

module.exports = student;