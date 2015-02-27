angular.module("genius-urban-youtube-app", ["ngMaterial"])
.controller('baseController', [
	'$scope',
	'$rootScope',
	'$http',
	'artistSongsService',
	'$interval', 
	function($scope, $rootScope, $http, artistSongsService, $interval){
		$rootScope.toSpin = false;
		$scope.queryArtistSongs = function(){
			$rootScope.toSpin = true;
			artistSongsService($scope.youtubeUrlMusicClip);
		};
	}
])
.factory('artistSongsService', ['$rootScope', '$http','$window', function($rootScope, $http,$window){
	return function(youtubeUrlMusicClip){
		if(youtubeUrlMusicClip === undefined && youtubeUrlMusicClip ==='')
		{
			$rootScope.toSpin = false;
			return;
		} else {
			var indexOfId = youtubeUrlMusicClip.indexOf("v=");
			if(indexOfId == -1){
				$rootScope.toSpin = false;
				return;
			}
			var youtubeVideoId = youtubeUrlMusicClip.substring(indexOfId+2);
			$http.post('/retrievelyricsFromYoutubeId', {youtubeVideoId : youtubeVideoId})
			.success(function(data, status, headers, config){
				$rootScope.data = data;
				$rootScope.toSpin = false;
			})
			.error(function(data, status, headers, config){
				/* 
				*	@TODO: change by a real error handler
				*
				*/
				
				$window.alert("error"); 
				$rootScope.toSpin = false;
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