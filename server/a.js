  var rapgeniusClient = require("rapgenius-js");
  var google = require('googleapis');
  var youtube = google.youtube('v3');
  var properties = require("properties");
  var urbanDictionnary = require('urban');
  var natural = require('natural');
  var tokenizer = new natural.WordTokenizer();
 


    properties.parse("vars", { path: true, variables: true }, function (error, p){
    if (error) return console.error (error);
    PROPERTIES_VARIABLE = p;


  
    youtube.videos.list({
            auth: PROPERTIES_VARIABLE.GOOGLE_API_KEY,
            id: "liZm1im2erU",
            part: "id,snippet"
        }, function(err, data) {
            rapgeniusClient.searchSong(data.items[0].snippet.title, "rap", function(err, songs) {
                rapgeniusClient.searchLyricsAndExplanations(songs[0].link, "rap", function(err, lyricsAndExplanations) {
                  //console.log(lyricsAndExplanations.lyrics.sections[0].verses[0].content);
                  var allTerms = tokenizer.tokenize(lyricsAndExplanations.lyrics.sections[0].verses[0].content);
                  displayData(allTerms);
                });
          });
      });
    });  

    var displayData = function(dataArray){
        
        for(var i = 0; i < dataArray.length; i++){
          urbanDictionnary(dataArray[3]).first(function(data){
              console.log(data);
          });
        }
        

        //console.log(dataArray);
    };