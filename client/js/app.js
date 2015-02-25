angular.module("genius-urban-youtube-app", [])
.controller('baseController', [
	'$scope',
	'$rootScope',
	'$http',
	'artistSongsService', 
	function($scope, $rootScope,$http, artistSongsService){
		$scope.queryArtistSongs = function(){
			artistSongsService($scope.artist);
		}
	}
])
.factory('artistSongsService', ['$rootScope','$http','$window', function($scope,$http,$window){
	return function(artist){
		$http.post('/artistSongs', {artist : artist})
		.success(function(data, status, headers, config){
			$scope.listSongs = data.songs;
		})
		.error(function(data, status, headers, config){
			$window.alert("error");
		});
	}
}]);
