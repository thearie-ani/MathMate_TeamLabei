const mongoose = require('mongoose')

const chapterSchema = new mongoose.Schema({
  subject_id: mongoose.Schema.Types.ObjectId,
  chapter_number: Number,
  title: String,
  created_at: Date,
})

module.exports = mongoose.model('Chapter', chapterSchema, 'chapters')