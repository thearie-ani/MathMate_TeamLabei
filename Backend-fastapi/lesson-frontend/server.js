require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

const Subject = require('./models/Subject')
const Chapter = require('./models/Chapter')
const Lesson = require('./models/Lesson')

const app = express()
app.use(express.static('public'))

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected DB:", mongoose.connection.name);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(collections.map(c => c.name));

    const count = await Subject.countDocuments();
    console.log("Subject count:", count);
  })
  .catch(console.error);

//Routes

// Get all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find()
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get chapters by subject slug
app.get('/api/subjects/:slug/chapters', async (req, res) => {
  try {
    const subject = await Subject.findOne({ slug: req.params.slug })
    if (!subject) return res.status(404).json({ error: 'Subject not found' })

    const chapters = await Chapter.find({ subject_id: subject._id })
      .sort({ chapter_number: 1 })
    res.json(chapters)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get lessons by chapter
app.get('/api/chapters/:chapterId/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find({ chapter_id: req.params.chapterId })
      .sort({ order_index: 1 })
      .select('title section_slug order_index') // no content_html in list
    res.json(lessons)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get single lesson by id
app.get('/api/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' })
    res.json(lesson)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Serve frontend
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`)
})