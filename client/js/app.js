angular.module("genius-urban-youtube-app", ["ngMaterial"])
.controller('baseController', [
	'$scope',
	'$rootScope',
	'$http',
	'artistSongsService',
	'$interval', 
	'$mdDialog',
	function($scope, $rootScope, $http, artistSongsService, $interval, $mdDialog){
		$rootScope.toSpin = false;
		$scope.queryArtistSongs = function(){
			$rootScope.toSpin = true;
			artistSongsService($scope.youtubeUrlMusicClip);
		};

		$scope.showAlert = function(ev, verse){
			var annotation = findAnnotationById(verse.id);
			if(annotation){
				$mdDialog.show(
					$mdDialog.alert()
					.theme('docs-dark')
			        .title(verse.content)
			        .content(annotation)
			        .ariaLabel('Password notification')
			        .ok('Got it!')
			        .disableParentScroll(false)//.hasBackdrop(false)
			        .targetEvent(ev)
			    );
			}
		};

		var findAnnotationById = function(id){
			return $rootScope.lyricsAndExplanations.explanations[id];
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
			
			//@TODO : Use browersify and the URL and QueryString node modules instead
			//---- FROM HERE ---
			var indexOfId = youtubeUrlMusicClip.indexOf("v=");
			if(indexOfId == -1){
				$rootScope.toSpin = false;
				$rootScope.doFail = true;
				$rootScope.failExplanation = "The url you pasted might not be well formatted, please copy and past raw urls directly from YouTube.com";
				return;
			}

			$rootScope.doFail = false;

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
				$rootScope.doFail = true;
				$rootScope.failExplanation = "Unknow Problem, feel free to report this issue on Twitter @Acen_1991";
				return;
			}

			$rootScope.doFail = false;	

			$http.post('/retrievelyricsFromYoutubeId', {youtubeVideoId : youtubeVideoId})
			.success(function(data, status, headers, config){
				if(data.error){
					$rootScope.doFail = true;
					$rootScope.failExplanation = data.explanation;
				} else {
					$rootScope.doFail = false;
					$rootScope.lyricsAndExplanations = data.lyricsAndExplanations;
				}

				$rootScope.toSpin = false;
			})
			.error(function(data, status, headers, config){
				/* 
				*	@TODO: change by a real error handler
				*
				*/
				console.log(status);
				
				$rootScope.doFail = false;
				$rootScope.failExplanation = status;
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
  })
.filter('normalizeFilter', function() {
  return function(text) {
  	if(text!==undefined) {
  		var formattedText = text.trim();
  		formattedText = formattedText.replace('\s+',' ');
  		formattedText = formattedText.replace('\t+',' ');
  		formattedText = formattedText.toUpperCase();

  		return formattedText;
  	}
  };
});