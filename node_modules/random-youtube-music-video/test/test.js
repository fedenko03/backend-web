const randomUrl = require("../index");

(async () => {
  console.log(await randomUrl.getRandomMusicVideoUrl(true));
})();
