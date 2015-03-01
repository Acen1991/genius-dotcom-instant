var coreModule = require("../server");
 
describe("normalize youtube title for genius.com API", function () {
  it("should removing weird words for Genius.com API to keep a simple title that holds : ARTISTS + SONG, whatever the semantic pattern", function () {
    var normalizedYoutubeTitle = coreModule.UTILS.normalizeYoutubeTitle("ILOVEMAKONNEN (FEAT. DRAKE) - TUESDAY     ");
    expect(normalizedYoutubeTitle).toBe('ilovemakonnen - tuesday');
  });
});

var drakeTuesday = [
	{name: 'best songs of 2014'}, 
	{name : 'ilovemakonnen tuesday'}, 
	{name: 'another weird title'}
];

var beyonceSevenEleven = [
	{name : '7/11 by Beyoncé'}, 
	{name : '7/11//GHS by Beyoncé'}, 
	{name : 'Top 5 jams 2014 by Treble_life'}, 
	{name : 'Who is slaying my life !?!? by Treble_life'},
	{name : 'Headlines by AWKWORD'}
];

describe("find the genius.com title that got the least leveinstein distance from the youtube video title", function () {
  it("should return the second element of the array", function () {
    var indexMinLev = coreModule.UTILS.indexMostSuitableGeniusSong('ilovemakonnen - tuesday', drakeTuesday);
    expect(indexMinLev).toBe(1);
  });

   it("should return the first element of the array", function () {
    var indexMinLev = coreModule.UTILS.indexMostSuitableGeniusSong('beyoncé - 7/11', beyonceSevenEleven);
    expect(indexMinLev).toBe(0);
  });
});


