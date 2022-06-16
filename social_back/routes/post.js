const express = require('express');
const router = express.Router();
const Post = require('../database/schemas/post');
const authorize = require('../middleware/authorize')

//authorization required (auth-token needed as a parameter)
//fetches all the posts of a given user. Needs the jwt token of the registered user as its parameter
router.get('/getposts', authorize, async (req, res) => {
    try {
        let userId = req.user.id
        let data = await Post.find({ user: userId });
        if(data.length===0)
        {
            res.status(404).send('No posts found!!')
        }
        else res.json(data);
    } catch (error) {
        res.send("Internal Server Error")
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
        else res.json(result);
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
        if(!newPost){
            res.status(404).send('Post not found')
        }
        else res.json(newPost);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

//authorization required (auth-token needed as a parameter)
//endpoint to delete a post using id as the parameter.
router.delete('/deletepost/:id', authorize,async (req, res) => {
    try {
        let deletedPost = await Post.findByIdAndDelete(req.params.id);
        if(!deletedPost){
            res.status(404).send('Post not found')
        }
        else res.json(deletedPost);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

module.exports = router;
