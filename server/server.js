  var express = require('express');
  var path = require('path');
  var app = express();
  bodyParser = require('body-parser');
  var rapgeniusClient = require("rapgenius-js");

  var rootDir = __dirname + '/../';
  var clientbuild = rootDir + 'client';

  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())

  app.use(express.static(clientbuild));
  
  app.set('views', path.join(rootDir, 'views'))
  app.set('view engine', 'jade')

  app.get('/', function(req, res) {
    res.render('index', {date: new Date().toDateString()})
  })


  app.post("/artistSongs", function(req,res){
    console.log(req.body.artist);

    rapgeniusClient.searchArtist(req.body.artist, "rap", function(err, artist){
      if(err){
        console.log("Error: " + err);
      }else{
        console.log("Rap artist found [name=%s, link=%s, popular-songs=%d]",
                    artist.name, artist.link, artist.popularSongs.length);

        res.end(JSON.stringify({
          songs : artist.popularSongs
        }));
      }
    });
  })
  
  app.listen(3000)

