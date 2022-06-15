const express = require('express');
const router = express.Router();
const Post = require('../database/schemas/post');
const Comment = require('../database/schemas/comments')
const authorize = require('../middleware/authorize')

//authorization required (auth-token needed as a parameter)
//fetches all the posts of a given user. Needs the jwt token of the registered user as its parameter
router.get('/getposts', authorize, async (req, res) => {
    try {
        let userId = req.user.id
        let data = await Post.find({ user: userId });
        res.json(data);
    } catch (error) {
        res.send("Internal Server Error")
    }
})


router.get('/getcomments/:id', authorize, async (req, res) => {
    try {
        let data = await Comment.find({post:req.params.id});
        res.json(data);
    } catch (error) {
        res.send("Could not find the comment")
    }
})

//authorization required (auth-token needed as a parameter)
//endpoint to create a post. Takes picture link, user id and description as parameters. Likes and date will not be taken from the user, their default values will be used
router.post("/createpost", authorize, async (req, res) => {
    try {
        let userId = req.user.id
        let data = {
            pictureLink: req.body.pictureLink,
            user: userId,
            description: req.body.description
        }
        let result = await Post.create(data);
        if (result === []) {
            res.send("An error Occured");
        }
        res.json(result);
    } catch (err) {
        res.send("Internal Server Error")
    }
});

//authorization required (auth-token needed as a parameter)
//endpoint to edit the number of likes or description. Takes the id of the post as the parameter and number of likes and new description in the body.
router.put('/updatepost/:id', authorize, async (req, res) => {
    try {
        let data = {
            likes: req.body.likes,
            description: req.body.description
        }
        let newPost = await Post.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
        res.json(newPost);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

//authorization required (auth-token needed as a parameter)
//endpoint to update or add new comments. takes id of the comment as the parameter along with comment and username in the body 
router.put('/updatecomment/:id', authorize, async (req, res) => {
    try {
            let data = {
            comment: req.body.comment,
            username:req.body.username,
            post:req.params.id
        }
        let newcomment = await Comment.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
        if(!newcomment){
            try{
                newcomment = await Comment.create(data);
                res.json(newcomment);
            }catch(err){
                res.send("error in saving comment in the database")
            }

        }
        else res.json(newcomment);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

//authorization required (auth-token needed as a parameter)
//endpoint to delete a post using id as the parameter.
router.delete('/deletepost/:id', async (req, res) => {
    try {
        let deletedPost = await Post.deleteOne({ _id: req.params.id });
        res.json(deletedPost);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

module.exports = router;
