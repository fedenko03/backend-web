const express = require('express')
const ejs = require('ejs')
var url = require('url');
const https = require('https')
const app = express()
const port = 3000

app.set('view-engine', 'ejs');
app.use(express.static(__dirname + 'img'));

const randomUrlGen = require("random-youtube-music-video");

app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

app.get('/', (req, res) => {
    res.render('main.ejs')
})

app.get('/login', (req, res) => {
    res.sendfile(__dirname+'/login.html')
})

app.get('/music', (req, res) => {
    res.sendfile(__dirname+'/music.html')
})

app.get('/rating', (req, res) => {
    res.sendfile(__dirname+'/rating.html')
})

app.get('/topics', (req, res) => {
    res.sendfile(__dirname+'/topics.html')
})

app.get('/rand-music',  async function(req, res) {
    var youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();
    var youtubeUrl2 = await randomUrlGen.getRandomMusicVideoUrl();
    var videoId1 = youtubeUrl.split("v=").pop();
    var videoId2 = youtubeUrl2.split("v=").pop();
    const apiKey = 'AIzaSyB-hqrG4rGD17RIAqyYXzEOFr54hZEHRjk';
    // var videoId1 = 1; IN DEVELOPMENT
    // var videoId2 = 1;
    // var urlname1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId1 + "&key="+ apiKey + "&fields=items(snippet(title))&part=snippet"
    // var urlname2 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoId2 + "&key="+ apiKey + "&fields=items(snippet(title))&part=snippet"
    //
    // https.get(urlname1, function (response){
    //     response.on("data", function (data){
    //         const Data = JSON.parse(data);
    //         const name1 = `${Data.items[0].snippet.title}`;
    //     })
    // })
    // https.get(urlname2, function (response){
    //     response.on("data", function (data){
    //         const Data2 = JSON.parse(data);
    //         const name2 = `${Data2.items[0].snippet.title}`;
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

