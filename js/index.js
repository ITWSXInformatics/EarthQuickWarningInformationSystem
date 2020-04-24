let app = angular.module('app', []);
app.controller('earth', function($scope,$http) {
	$scope.submit =() =>{
		let timeDistance = document.getElementById("timeDistance").value;
		let radius = document.getElementById("radius").value;
		let magnitude = document.getElementById("magnitude").value;

		$http({
			method: 'POST',
			url: '/search',
			data:{
				timeDistance:timeDistance,
				radius:radius,
				magnitude:magnitude
			}
		}).then(function successCallback(response) {
			// this callback will be called asynchronously
			// when the response is available
			console.log("success test");
		}, function errorCallback(response) {
			console.log("test failed");
			console.log(response);
			// called asynchronously if an error occurs
			// or server returns response with an error status.
		});
	}
});




