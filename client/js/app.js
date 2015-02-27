angular.module("genius-urban-youtube-app", ["ngMaterial"])
.controller('baseController', [
	'$scope',
	'$rootScope',
	'$http',
	'artistSongsService', 
	function($scope, $rootScope,$http, artistSongsService){
		
		$scope.queryArtistSongs = function(){
			artistSongsService($scope.youtubeUrlMusicClip);
		};
	}
])
.factory('artistSongsService', ['$rootScope', '$http','$window', function($rootScope, $http,$window){
	return function(youtubeUrlMusicClip){
		if(youtubeUrlMusicClip !== undefined){
			var indexOfId = youtubeUrlMusicClip.indexOf("v=");
			var youtubeVideoId = youtubeUrlMusicClip.substring(indexOfId+2);
			$http.post('/retrievelyricsFromYoutubeId', {youtubeVideoId : youtubeVideoId})
			.success(function(data, status, headers, config){
				$rootScope.data = data;
			})
			.error(function(data, status, headers, config){
				/* 
				*	@TODO: change by a real error handler
				*
				*/
				$window.alert("error"); 
			});
		}
	};
}])
.config(function($mdThemingProvider){
    // Configure a dark theme with primary foreground yellow - the Genius.com theme !
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
  });