const express = require('express');
const router = express.Router();
const cloud = require('cloudinary');
router.get("/home", function(req, res) {
    res.render("home");
});

router.get("/login", function(req, res) {
    res.render("login", {message : ""})
});

router.get("/signup", function(req, res) {
    res.render("signup", {message : ''})
});

router.get("/c", function(req, res) {
    res.render("content")
});

router.get('/image', function(req, res) {
    res.redirect(cloud.url('v1601473877/a4xbfs8o7g7q6n7d9hfg.png'))
})

module.exports = router;