module.exports = function(app){
  var rapgeniusClient = require("rapgenius-js");
  var google = require('googleapis');
  var youtube = google.youtube('v3');
  var nlpModule = require("./nlpModule");
  

  app.get('/', function(req, res) {
      res.render('index.html');
  });

  /* 
   * @TODO: this controller is least robust one that I have built so far !!!
   *
   */
  app.post("/retrievelyricsFromYoutubeId", function(req, res) {
    if(req.body.youtubeVideoId !== undefined && req.body.youtubeVideoId !== "") {
      youtube.videos.list({
          auth: process.env.GOOGLE_API_KEY,
          id: req.body.youtubeVideoId,
          part: "id,snippet"
      }, function(err, data) {
         if(err) {
            res.end(JSON.stringify({error : true, explanation: "can't find the youtube video provided"}));
            return;
          }
          if(data.items === undefined || data.items === null || data.items[0] === undefined || data.items[0] === null){
            res.end(JSON.stringify({error : true, explanation : "unknow Youtube video, please double check the URL provided"}));
            return;
          }

          var normalizedYoutubeTitle = nlpModule.normalizeYoutubeTitle(data.items[0].snippet.title);
          rapgeniusClient.searchSong(normalizedYoutubeTitle, "rap", function(err, songs) {
              if (err) {
                  res.end(JSON.stringify({error : true, explanation : "problem with the Genius.com API"}));
                  return;
              } else {
                  if(songs===undefined || songs[0] === undefined || songs[0] === null){
                    res.end(JSON.stringify({error : true, explanation : "can't find any lyrics for the youtube link provided"}));
                    return;
                  }

                  var iMostSuitable = nlpModule.indexMostSuitableGeniusSong(normalizedYoutubeTitle, songs);
                  
                  rapgeniusClient.searchLyricsAndExplanations(songs[iMostSuitable].link, "rap", function(err, lyricsAndExplanations) {
                      if (err) {
                          res.end(JSON.stringify({error : true, explanation: "can't find the lyrics for the youtube link provided"}));
                          return;
                      } else {
                          res.end(JSON.stringify({
                              lyricsAndExplanations: lyricsAndExplanations
                          }));
                      }
                  });
              }
          });
      });
    }
  });


};