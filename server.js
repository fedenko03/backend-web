const express = require('express')
const ejs = require('ejs')
var url = require('url');
const https = require('https')
const app = express()
const port = 3000

app.set('view-engine', 'ejs');

app.use(express.static('static'));

const randomUrlGen = require("random-youtube-music-video");

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.render('main.ejs')
})

app.get('/login', (req, res) => {
    res.render('login.ejs')
})

app.get('/music', (req, res) => {
    res.render('music.ejs')
})

app.get('/rating', (req, res) => {
    res.render('rating.ejs')
})

app.get('/topics', (req, res) => {
    res.render('topics.ejs')
})

app.get('/rand-music',  async function(req, res) {
    var youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();
    var youtubeUrl2 = await randomUrlGen.getRandomMusicVideoUrl();
    var videoId1 = youtubeUrl.split("v=").pop();
    var videoId2 = youtubeUrl2.split("v=").pop();
    const apiKey = 'AIzaSyB-hqrG4rGD17RIAqyYXzEOFr54hZEHRjk';
    var urlname1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId1 + "&key="+ apiKey + "&fields=items(snippet(title))&part=snippet"
    var urlname2 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId2 + "&key="+ apiKey + "&fields=items(snippet(title))&part=snippet"
    let name1 = ""
    let name2 = ""

    // https.get(urlname1, function (response){ // in developing
    //     response.on("data", function (data){
    //         const Data = JSON.parse(data);
    //         name1 = Data.items[0].snippet.title;
    //     })
    // })
    // console.log(name1)
    // https.get(urlname2, function (response){
    //     response.on("data", function (data){
    //         const Data2 = JSON.parse(data);
    //         name2 = Data2.items[0].snippet.title;
    //     })
    // })

    res.render('video.ejs', {music_url1: videoId1, music_url2: videoId2});
})

app.get('/rand_views', async function(req, res) {
    var youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();
    var videoId = youtubeUrl.split("v=").pop();
    const key = 'AIzaSyB-hqrG4rGD17RIAqyYXzEOFr54hZEHRjk';
    const url = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId + "&key=" + key + "&part=statistics";

    https.get(url, function (response){
        response.on("data", function (data){
            const Data3 = JSON.parse(data);
            res.render('random-video.ejs', {video_Id: videoId, views: Data3.items[0].statistics.viewCount})
        })

    })
})

