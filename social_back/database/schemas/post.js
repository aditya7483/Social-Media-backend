const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({

    //the object id of the user who made the post
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },

    pictureLink: {
        type: String,
        required: true
    },

    description: {
        type: String,
        default:''
    },

    date: {
        type: Date,
        default: Date.now
    },

    //likes will by default has to be 0 initially.
    likes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('notes', postSchema);