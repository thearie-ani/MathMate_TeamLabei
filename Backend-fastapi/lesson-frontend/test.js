const mongoose = require('mongoose')
require('dotenv').config()

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const db = mongoose.connection.db
  
  // List all databases and collections
  const collections = await db.listCollections().toArray()
  console.log('Connected to DB:', db.databaseName)
  console.log('Collections:', collections.map(c => c.name))
  
  // Count documents in each
  for (const col of collections) {
    const count = await db.collection(col.name).countDocuments()
    console.log(`  ${col.name}: ${count} documents`)
  }

  mongoose.disconnect()
})