const express = require('express');
const router = express.Router();
const Note = require('../database/schemas/post');
const authorize = require('../middleware/authorize')

router.get('/getposts', authorize, async (req, res) => {
    try {
        let userId = req.user.id
        let data = await Note.find({ user: userId });
        res.json(data);
    } catch (error) {
        res.send("Internal Server Error")
    }
})

router.post("/createpost", authorize, async (req, res) => {
    try {
        let result = await Note.insertMany(req.body);
        if (result === []) {
            res.send("An error Occured");
        }
        res.json(result);
    } catch (err) {
        res.send("Internal Server Error")
    }
});

router.put('/updatepost/:id', async (req, res) => {
    try {
        let note = await Note.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(note);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

router.delete('/deletepost/:id', async (req, res) => {
    try {
        let note = await Note.deleteOne({ _id: req.params.id });
        res.json(note);
    } catch (error) {
        res.status(404).send("Internal Server Error")
    }
})

module.exports = router;
