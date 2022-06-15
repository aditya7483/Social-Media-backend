const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
    username:{
      type:String,
      required:true
    },
    
    //the actual comment
    comment:{
        type:String,
        required:true
    },

    //the id of the post of which the comment is a part of 
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'post',
        required:true
    },

    date:{
        type:Date,
        default: Date.now
    }
    
})

module.exports = mongoose.model('comments',commentsSchema);