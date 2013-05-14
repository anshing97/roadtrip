// form controller 
var homeCtrl = ['$scope', '$location', 'DataService', 'StopsResource', function ($scope, $location, DataService, StopsResource) {

	$scope.loading = false; 	

	var clearLoading = function () {
		$scope.loading = false; 
	}

	// user pressed submit on trip origin and destination 
    $scope.submitTrip = function (trip) {

    	$scope.loading = true; 

		// query the rest api for data 
		StopsResource.get({origin:trip.origin, destination:trip.destination},
			function (data) {
				DataService.setData(data);
				$location.path('/trip/');
				clearLoading();
			}, 
			function (err) {
				alert("Unable to find a route from " + trip.origin + " to " + trip.destination + ".\n\nTry a different cities. Or enter city, state.");
				clearLoading(); 
			}
		);

    };

}];
 

// trip controller 
var tripCtrl = ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {

	// check that we really have data 
	if ( ! DataService.hasData() ) {

		$location.path('/');

	} else {

		$scope.tripData = DataService.getData();
		$scope.tripStops = $scope.tripData.towns;
		$scope.tripDistance = Math.floor($scope.tripData.distance / 1609);
		$scope.tripCities = $scope.tripData.towns.length; 
		$scope.tripMap = "https://maps.google.com/maps?f=d&hl=en&ie=UTF8&q=" + $scope.tripData.googleMaps; 
	}

}];

