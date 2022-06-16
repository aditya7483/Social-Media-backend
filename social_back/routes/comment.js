const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize')
const User = require('../database/schemas/user');
const Post = require('../database/schemas/post');
const Comment = require('../database/schemas/comments')

//endpoint to get all the comments of a particular post whose id is passed as a parameter.
router.get('/getcomments/:id', async (req, res) => {
    try {
        let data = await Comment.find({ post: req.params.id });
        if (data.length === 0) {
            res.status(404).send('could not find comments with the post id')
        }
        else res.json(data);
    } catch (error) {
        res.send("Internal Server Error")
    }
})

//authorization required (auth-token needed as a parameter)
//That is the auth-token of the user creating the comment
//endpoint to create a comment on a post. takes the id of the post as the parameter with comment in the body.
router.post('/createcomment/:id', authorize, async (req, res) => {

    try {
        //find user by thier id to fetch their username
        let userInfo = await User.findById(req.user.id)
        if (!userInfo) {
            res.status(404).send('user not found')
        }

        else {

            //find out if the post with the given id exists
            let findPost = Post.findById(req.params.id)
            if (!findPost) {
                res.status(404).send('Post not found')
            }
            else {
                let data = {
                    comment: req.body.comment,
                    username: userInfo.username,
                    post: req.params.id
                }
                newcomment = await Comment.create(data);
                res.json(newcomment);
            }
        }
    }
    catch (err) {
        res.status(404).send("Internal Server Error")
    }

})

//authorization required (auth-token needed as a parameter)
//That is the auth-token of the user editing the comment
//endpoint to update comments. takes id of the comment to be updated as the parameter along with updated comment in the body 
router.put('/updatecomment/:id', authorize, async (req, res) => {
    try {
        let userInfo = await User.findById(req.user.id)
        let findComm = await Comment.findById(req.params.id)

        //if either the user or the comment does not exist
        if (!userInfo || !findComm) {
            res.status(404).send('Not Found!!')
        }

        //if the username of the comment to be edited does not match the username extracted from the given auth-token don't allow the update
        else if (findComm.username != userInfo.username) {
            res.status(401).send('This action is not permitted')
        }

        else {

            let data = {
                comment: req.body.comment,
                date: Date.now()
            }

            let newcomment = await Comment.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });

            if (!newcomment) {
                res.status(404).send('comment not found')
            }
            else res.json(newcomment);
        }
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

//authorization required (auth-token needed as a parameter)
//auth-token of the user deleting the comment
//endpoint to delete a comment using id as the parameter.
router.delete('/deletecomment/:id', authorize, async (req, res) => {
    try {
        let userInfo = await User.findById(req.user.id)
        let findComm = await Comment.findById(req.params.id)

        //if either the user or the comment does not exist
        if (!userInfo || !findComm) {
            res.status(404).send('Not Found!!')
        }

        //if the username of the comment to be edited does not match the username extracted from the given auth-token don't allow the delete
        else if (findComm.username != userInfo.username) {
            res.status(401).send('This action is not permitted')
        }

        else {
            let deletedPost = await Comment.findByIdAndDelete(req.params.id);
            res.json(deletedPost);
        }
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

module.exports = router