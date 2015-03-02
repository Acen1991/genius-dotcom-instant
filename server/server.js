  var express = require('express');
  var path = require('path');
  var rapgeniusClient = require("rapgenius-js");
  var google = require('googleapis');
  var youtube = google.youtube('v3');
  var bodyParser = require('body-parser');
  var nlpNode = require('natural');
  
  var app = express();

  app.set('port', (process.env.PORT || 5000));

  var rootDir = __dirname + '/../';
  var clientbuild = rootDir + 'client';

  app.use(bodyParser.urlencoded({
      extended: false
  }));

  app.use(bodyParser.json());

  app.use(express.static(clientbuild));

  app.engine('html', require('ejs').renderFile);
  app.set('views', path.join(rootDir, 'views_html'));

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
          if(data.items === undefined || data.items === null){
            res.end(JSON.stringify({error : true, explanation : "unknow error from Youtube"}));
            return;
          }

          var normalizedYoutubeTitle = normalizeYoutubeTitle(data.items[0].snippet.title);
          rapgeniusClient.searchSong(normalizedYoutubeTitle, "rap", function(err, songs) {
              if (err) {
                  res.end(JSON.stringify({error : true, explanation : "problem with the Genius.com API"}));
                  return;
              } else {
                  if(songs===undefined || songs[0] === undefined || songs[0] === null){
                    res.end(JSON.stringify({error : true, explanation : "can't find any lyrics for the youtube link provided"}));
                    return;
                  }

                  var iMostSuitable = indexMostSuitableGeniusSong(normalizedYoutubeTitle, songs);
                  
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

  app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
  });

  var normalizeYoutubeTitle = function(youtubeTitle){
    youtubeTitle = youtubeTitle.toLowerCase();
    var weirdGeniusWords = /\(.*\)/i;

    youtubeTitle = youtubeTitle.replace(weirdGeniusWords, '');
    youtubeTitle = youtubeTitle.replace(/\s\s*/, ' ');
    youtubeTitle = youtubeTitle.trim();

    return youtubeTitle;
  };

  /*
  * we get the whole list of genius songs that match for our request
  * then, we look for the song that got the least leveinstein distance with the normalized youtube title
  */
  var indexMostSuitableGeniusSong = function(normalizedYoutubeTitle, geniusSongs){
    var iMinLev = 0;
    var minLev = nlpNode.LevenshteinDistance(normalizedYoutubeTitle, geniusSongs[0].name.toLowerCase());

    for(var i = 1; i < geniusSongs.length; i++){
      var geniusSongNormalized = geniusSongs[i].name.toLowerCase().trim();
      var currentLev = nlpNode.LevenshteinDistance(normalizedYoutubeTitle, geniusSongNormalized);

      if(currentLev < minLev){
        minLev = currentLev;
        iMinLev = i;
      } 
    }
    
    return iMinLev; 
  };

  exports.UTILS = {
    normalizeYoutubeTitle : normalizeYoutubeTitle,
    indexMostSuitableGeniusSong : indexMostSuitableGeniusSong
    };