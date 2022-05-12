# random-youtube-music-video 📺
Fetch the URL of a random music video on YouTube

# Description

Fetch a pseudo-random music video url from YouTube

# Install

`npm install random-youtube-music-video`

# Usage

```
const randomUrlGen = require("random-youtube-music-video");
const youtubeUrl = await randomUrlGen.getRandomMusicVideoUrl();

console.log(youtubeUrl);
// `https://www.youtube.com/watch?v=XXYlFuWEuKI` (prints youtube video url)
```

# Acknowledgements

This repo draws heavily on work done here: https://github.com/amitness/shuffle.

# Disclaimer

Use this at your own discretion. The creators of this module do not endorse or encourage the usage of this module. By using this module, you agree the creators of this module are not responsible for any possible consequences you face by using this module (such as, but not limited to, if YouTube decides to block your IP address).
