// form controller 
var homeCtrl = ['$scope', '$location', 'DataService', 'StopsResource', function ($scope, $location, DataService ,StopsResource) {

	// user pressed submit on trip origin and destination 
    $scope.submitTrip = function (trip) {
		StopsResource.get({origin:trip.origin, destination:trip.destination},
			function (data) {
				DataService.setData(data);
				$location.path('/trip/');
			}, 
			function (err) {
				alert("Try entering City, State");
			}
		);
    };

}];
 

// trip controller 
var tripCtrl = ['$scope', 'DataService', function ($scope, DataService) {

	$scope.tripData = DataService.getData(); 
	$scope.tripStops = $scope.tripData.towns;
	$scope.tripDistance = Math.floor($scope.tripData.distance / 1609);
	$scope.tripCities = $scope.tripData.towns.length; 
	$scope.tripMap = "https://maps.google.com/maps?f=d&hl=en&ie=UTF8&q=" + $scope.tripData.googleMaps; 

}];

