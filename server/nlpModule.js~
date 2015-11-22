module.exports = {
    normalizeYoutubeTitle: normalizeYoutubeTitle,
    indexMostSuitableGeniusSong: indexMostSuitableGeniusSong
};


var nlpNode = require('natural');

function normalizeYoutubeTitle(youtubeTitle) {
    youtubeTitle = youtubeTitle.toLowerCase();
    var weirdGeniusWords = /\(.*\)/i;

    youtubeTitle = youtubeTitle.replace(weirdGeniusWords, '');
    youtubeTitle = youtubeTitle.replace(/\s\s*/, ' ');
    youtubeTitle = youtubeTitle.trim();

    return youtubeTitle;
}

/*
 * we get the whole list of genius songs that match for our request
 * then, we look for the song that got the least leveinstein distance with the normalized youtube title
 */
function indexMostSuitableGeniusSong(normalizedYoutubeTitle, geniusSongs) {
    var iMinLev = 0;
    var minLev = nlpNode.LevenshteinDistance(normalizedYoutubeTitle, geniusSongs[0].name.toLowerCase());

    for (var i = 1; i < geniusSongs.length; i++) {
        var geniusSongNormalized = geniusSongs[i].name.toLowerCase().trim();
        var currentLev = nlpNode.LevenshteinDistance(normalizedYoutubeTitle, geniusSongNormalized);

        if (currentLev < minLev) {
            minLev = currentLev;
            iMinLev = i;
        }
    }

    return iMinLev;
}