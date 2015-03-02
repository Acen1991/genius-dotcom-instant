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
			//provide a more understanble message
			return;
		} else {
			
			//@TODO : Use browersify and the URL and QueryString node modules instead
			//---- FROM HERE ---
			var indexOfId = youtubeUrlMusicClip.indexOf("v=");
			if(indexOfId == -1){
				$rootScope.toSpin = false;
				$rootScope.wrongUrlFormat = true;
				return;
			}

			var youtubeVideoId;
			var indexAnd;
			if((indexAnd = youtubeUrlMusicClip.indexOf("&")) == -1){
				youtubeVideoId = youtubeUrlMusicClip.substring(indexOfId+2);
			} else {
				youtubeVideoId = youtubeUrlMusicClip.substring(indexOfId+2, indexAnd);
			}
			//---- TO HERE ---

			if(youtubeVideoId === undefined){
				$rootScope.toSpin = false;
				//provide a more understanble message
				$rootScope.unknowProblem = true;
				return;
			}

			$http.post('/retrievelyricsFromYoutubeId', {youtubeVideoId : youtubeVideoId})
			.success(function(data, status, headers, config){
				if(data.error){
					$rootScope.notFound = true;
					$rootScope.errorExplanation = data.explanation;
				} else {
					$rootScope.data = data;
					$rootScope.toSpin = false;
				}
			})
			.error(function(data, status, headers, config){
				/* 
				*	@TODO: change by a real error handler
				*
				*/
				$window.alert("unkown error"); 
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