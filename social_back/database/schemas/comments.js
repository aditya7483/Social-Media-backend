const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    username:{
      type:String,
      required:true
    },
    
    comment:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        default: Date.now
    }
    
})

module.exports = mongoose.model('comments',commentsSchema);