  var express = require('express');
  var path = require('path');
  var rapgeniusClient = require("rapgenius-js");
  var google = require('googleapis');
  var youtube = google.youtube('v3');
  var bodyParser = require('body-parser');
  
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
          //@TODO: provide more comprehensible messages for client
            res.end(JSON.stringify({error : true}));
            return;
          }
          if(data.items === undefined || data.items === null){
            //@TODO: provide more comprehensible messages for client
            res.end(JSON.stringify({error : true}));
            return;
          }

          rapgeniusClient.searchSong(normalizeYoutubeTitle(data.items[0].snippet.title), "rap", function(err, songs) {
              if (err) {
                  //@TODO: provide more comprehensible messages for client
                  res.end(JSON.stringify({error : true}));
                  return;
              } else {
                  if(songs[0] === undefined || songs[0] === null){
                    //@TODO: provide more comprehensible messages for client
                    res.end(JSON.stringify({error : true}));
                    return;
                  }
                  rapgeniusClient.searchLyricsAndExplanations(songs[0].link, "rap", function(err, lyricsAndExplanations) {
                      if (err) {
                          res.end(JSON.stringify({error : true}));
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

    return youtubeTitle;
  };