const express = require('express')
const bodyParser = require('body-parser')
const ejs = require("ejs");
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const request = require('request');
const https = require('https')
const axios = require('axios');
const app = express()
app.use(express.static('static'));
const session = require('express-session')
const db = require('./db'); // database
const swaggerUi = require('swagger-ui-express') ;
const swaggerDocument = require('./swagger/openapi.json')

app.set('view-engine', 'ejs');

app.use(session({
    secret: '4R34KR32K2D32JFNJNJkdfs',
    resave: false,
    saveUninitialized: false
    })
)


app.use(bodyParser.urlencoded({extended:true}));


app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const UserRoute = require('./routes/UserRoute')
const Mode1Model = require('./models/Mode1Model')
app.use('/',UserRoute)

app.get('/login', (req, res) => {
    let mess = ''
    if (req.session.username) {
        return res.redirect('/topics')
    }
    res.render('login.ejs', {message: mess})
})

app.get('/login-error', (req, res, message_error) => {
    res.render('login.ejs', {message: message_error})
})

app.get('/register', (req, res) => {
    if (req.session.username) {
        return res.redirect('/topics')
    }
    res.render('register.ejs')
})

const randomUrlGen = require("random-youtube-music-video"); // generate link for random YT music video

app.get('/', async function (req, res) {
    try {
        var youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();
        var videoId = youtubeUrl.split("v=").pop();
        const key = 'AIzaSyB-hqrG4rGD17RIAqyYXzEOFr54hZEHRjk';
        const url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + key + "&part=statistics"; // API for get video statistics (views)
        // console.log(url)
            https.get(url, function (response) {
            response.on("data", function (data) {
                const Data3 = JSON.parse(data);
                var views_v, likes_v, comments_v;

                try {
                    views_v = Data3.items[0].statistics.viewCount
                } catch {
                    views_v = "—"
                }

                try {
                    likes_v = Data3.items[0].statistics.likeCount
                } catch {
                    likes_v = "—"
                }

                try {
                    comments_v = Data3.items[0].statistics.commentCount
                } catch {
                    comments_v = "—"
                }

                var re = /(?=\B(?:\d{3})+(?!\d))/g
                res.render('main.ejs', {video_Id: videoId, views: views_v.replace(re,' '), likes: likes_v.replace(re,' '), comments: comments_v.replace(re,' '), username: req.session.username})
            })

        })
    } catch {
        res.render('main.ejs', {video_Id: 0, views: 0, likes: 0, comments: 0, username: req.session.username})
    }
})

app.get('/rating', async function (req, res) {
    if (!req.session.username) {
        let mess = 'To use the site, log in'
        res.set('Content-type', 'text/html')
        return res.render('login.ejs', {message: mess})
    }
    await request.get({
        url: 'https://api.api-ninjas.com/v1/facts', // API for generate random fact
        headers: {
            'X-Api-Key': 'Y9hfDSA5JcX6olMaTnpt2g==wnBRbjTSbkNhKgHN'
        }
    }, function (error, response, body) {
        if (error) return console.error('Request failed:', error);
        else if (response.statusCode != 200) {
            console.error('Error:', response.statusCode, body.toString('utf8'));
            return res.render('rating.ejs', {random_fact: "Internal server error"})
        }
        // else console.log(body) // for testing
        let bdy = JSON.parse(body)
        res.render('rating.ejs', {random_fact: bdy[0].fact, username: req.session.username})
    })
})


app.get('/topics', (req, res) => {
    if (req.session.username) {
        return res.render('topics.ejs', {username: req.session.username})
    }
    let mess = 'To use the site, log in'
    return res.render('login.ejs', {message: mess, username: req.session.username})
})


app.get('/mode1', async function (req, res) { // mode1
    if (!req.session.username) {
        let mess = 'To use the site, log in'
        return res.render('login.ejs', {message: mess})
    }
    var links = await Mode1Model.find()
        .catch(err => res.send(err));
    var random = Math.floor(Math.random() * 5) + 1; // random integer from 1 to 5
    var title1 = links[random].title
    var link1 = links[random].link.split("v=").pop();
    var title2 = links[random - 1].title
    var link2 = links[random - 1].link.split("v=").pop();
    if (title1 == undefined) {
        title1 = "Option 1"
    }
    if (title2 == undefined) {
        title2 = "Option 2"
    }
    res.render('mode1.ejs', {music_url1: link1, music_url2: link2, music_title1: title1, music_title2: title2, username: req.session.username});
})


app.get('/mode-random', async function (req, res) {
    if (!req.session.username) {
        let mess = 'To use the site, log in'
        return res.render('login.ejs', {message: mess})
    }
    var youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();
    var youtubeUrl2 = await randomUrlGen.getRandomMusicVideoUrl();
    var videoId1 = youtubeUrl.split("v=").pop();
    var videoId2 = youtubeUrl2.split("v=").pop();
    const apiKey = 'AIzaSyB-hqrG4rGD17RIAqyYXzEOFr54hZEHRjk';
    var urlname1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId1 + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet" // api for get information about YT video (title)
    var urlname2 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId2 + "&key=" + apiKey + "&fields=items(snippet(title))&part=snippet"
    let name1 = "First option"
    let name2 = "Second option"
    async function getName(url) {
        try {
            const response = await axios.get(url)
            return response.data.items[0].snippet.title;
        } catch (error) {
            console.log(error.response);
        }
    }
    name1 = await getName(urlname1)
    name2 = await getName(urlname2)
    res.render('mode-random.ejs', {
        music_url1: videoId1,
        music_url2: videoId2,
        music_title1: name1,
        music_title2: name2,
        username: req.body.username
    });
})


app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port http://localhost:%d in %s mode", this.address().port, app.settings.env);
});
