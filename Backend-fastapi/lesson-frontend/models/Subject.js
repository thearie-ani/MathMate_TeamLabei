const mongoose = require('mongoose')

const subjectSchema = new mongoose.Schema({
  name: String,
  slug: String,
  created_at: Date,
})

module.exports = mongoose.model('Subject', subjectSchema, 'subjects')