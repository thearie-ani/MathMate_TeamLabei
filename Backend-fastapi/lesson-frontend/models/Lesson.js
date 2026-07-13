

const mongoose = require('mongoose')

const lessonSchema = new mongoose.Schema({
  subject_id: mongoose.Schema.Types.ObjectId,
  chapter_id: mongoose.Schema.Types.ObjectId,
  section_slug: String,
  title: String,
  content_html: String,
  url: String,
  order_index: Number,
  created_at: Date,
})

module.exports = mongoose.model('Lesson', lessonSchema, 'lessons')