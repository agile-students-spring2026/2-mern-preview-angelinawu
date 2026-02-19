require('dotenv').config({ silent: true }) // load environmental variables from a hidden file named .env
const express = require('express') // CommonJS import style!
const morgan = require('morgan') // middleware for nice logging of incoming HTTP requests
const cors = require('cors') // middleware for enabling CORS (Cross-Origin Resource Sharing) requests.
const mongoose = require('mongoose')

const app = express() // instantiate an Express object
app.use(morgan('dev', { skip: (req, res) => process.env.NODE_ENV === 'test' })) // log all incoming requests, except when in unit test mode.  morgan has a few logging default styles - dev is a nice concise color-coded style
app.use(cors()) // allow cross-origin resource sharing

// use express's builtin body-parser middleware to parse any data included in a request
app.use(express.json()) // decode JSON-formatted incoming POST data
app.use(express.urlencoded({ extended: true })) // decode url-encoded incoming POST data

const path = require('path')

// serve static files (e.g., images) from the public folder
app.use('/public', express.static(path.join(__dirname, 'public')))

// connect to database
mongoose
  .connect(`${process.env.DB_CONNECTION_STRING}`)
  .then(data => console.log(`Connected to MongoDB`))
  .catch(err => console.error(`Failed to connect to MongoDB: ${err}`))

// load the dataabase models we want to deal with
const { Message } = require('./models/Message')
const { User } = require('./models/User')

// a route to handle fetching all messages
app.get('/messages', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({})
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})

// a route to handle fetching a single message by its id
app.get('/messages/:messageId', async (req, res) => {
  // load all messages from database
  try {
    const messages = await Message.find({ _id: req.params.messageId })
    res.json({
      messages: messages,
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    res.status(400).json({
      error: err,
      status: 'failed to retrieve messages from the database',
    })
  }
})
// a route to handle logging out users
app.post('/messages/save', async (req, res) => {
  // try to save the message to the database
  try {
    const message = await Message.create({
      name: req.body.name,
      message: req.body.message,
    })
    return res.json({
      message: message, // return the message we just saved
      status: 'all good',
    })
  } catch (err) {
    console.error(err)
    return res.status(400).json({
      error: err,
      status: 'failed to save the message to the database',
    })
  }
})

// a simple about JSON endpoint used by the front-end
app.get('/api/about', (req, res) => {
  return res.json({
    title: 'About Angelina Wu',
    imageUrl: '/public/angelina.jpg',
    paragraphs: [
      "Hi my name is Angelina Wu.",
      " I am from San Jose, California and I go to NYU. I study Computer Science and Economics and am currently a sophomore. I like drawing and painting in my free time, recently getting into pottery and crocheting. Art helps me relax when school gets stressful. It feels different from coding and lets me be more creative.",
      "I have done a bunch of random partime different jobs and projects that helped me learn how to work with people. I have skills in teamwork and organization. I like being part of clubs and meeting new people. I am in groups like GDG, MUn and SWE in school  and I enjoy being involved. I have a cat and I like spending time with her. I also like working on side projects. I want to travel to places like Japan and Korea in the future. I am always trying new things and learning as I go.",
      "I like rock climbing and am interested in new experiences.",
      "Nice to meet you ."
    ],
  })
})

// export the express app we created to make it available to other modules
module.exports = app // CommonJS export style!
