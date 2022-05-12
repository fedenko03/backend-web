const express = require('express')
const mongoose = require('mongoose');
const request = require('request');
// const ejs = require('ejs')
// var url = require('url')
const https = require('https')
const axios = require('axios');
const app = express()
const db = require('./db'); // database
const port = 3000
app.set('view-engine', 'ejs');

const mode1Schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
});
const mode1 = mongoose.model('mode1', mode1Schema);

app.use(express.static('static'));

const randomUrlGen = require("random-youtube-music-video"); // generate link for random YT music video

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

app.get('/', async function (req, res) {
    res.render('main.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/rating', async function (req, res) {
    await request.get({
        url: 'https://api.api-ninjas.com/v1/facts', // API for generate random fact
        headers: {
            'X-Api-Key': 'Y9hfDSA5JcX6olMaTnpt2g==wnBRbjTSbkNhKgHN'
        }
    }, function (error, response, body) {
        if (error) return console.error('Request failed:', error);
        else if (response.statusCode != 200) return console.error('Error:', response.statusCode, body.toString('utf8'));
        // else console.log(body) // for testing
        let bdy = JSON.parse(body)
        res.render('rating.ejs', {random_fact: bdy[0].fact})
    })
})

app.get('/topics', (req, res) => {
    res.render('topics.ejs')
})

app.get('/mode1', async function (req, res) { // mode1
    var links = await mode1.find()
        .catch(err => res.send(err));
    var random = Math.floor(Math.random() * 5) + 1; // random integer from 1 to 5
    var title1 = links[random].title
    var link1 = links[random].link.split("v=").pop();
    var title2 = links[random - 1].title
    var link2 = links[random - 1].link.split("v=").pop();
    res.render('mode1.ejs', {music_url1: link1, music_url2: link2, music_title1: title1, music_title2: title2});
})

app.get('/mode-random', async function (req, res) {
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
        music_title2: name2
    });
})

app.get('/rand_views', async function (req, res) {
    var youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();
    var videoId = youtubeUrl.split("v=").pop();
    const key = 'AIzaSyB-hqrG4rGD17RIAqyYXzEOFr54hZEHRjk';
    const url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + key + "&part=statistics"; // API for get video statistics (views)

    https.get(url, function (response) {
        response.on("data", function (data) {
            const Data3 = JSON.parse(data);
            res.render('main-random-video.ejs', {video_Id: videoId, views: Data3.items[0].statistics.viewCount})
        })

    })
})
