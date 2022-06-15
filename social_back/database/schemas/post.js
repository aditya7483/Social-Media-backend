const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    pictureLink: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now
    },

    likes: {
        type: Number,
        default: 0
    },

    comments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }
})

module.exports = mongoose.model('notes', postSchema);