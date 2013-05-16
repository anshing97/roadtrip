// form controller 
var homeCtrl = ['$scope', '$location', 'DataService', 'StopsResource', function ($scope, $location, DataService, StopsResource) {

	$scope.loading = false;

	var clearLoading = function () {
		$scope.loading = false; 
	}

	// user pressed submit on trip origin and destination 
  $scope.submitTrip = function (trip) {

		$scope.loading = true; 

		StopsResource.get({origin:trip.origin,destination:trip.destination},
			function (success) {
        // once we have the job id, get the promise for the job
        var promise = DataService.getJobData(success.job);
        promise.then( function (data) {
          DataService.setData(data);
          $location.path('/trip/');
        }, function (failure_reason) {
            alert("Unable to find a route from " + trip.origin + " to " + trip.destination + ".\n\nTry a different cities. Or enter city, state.");
            clearLoading();
        });
      },
      function (failure) {
        alert("We're sorry but our server is too busy right now.\n\nPlease try again later.");
					clearLoading();
			}
    );
  };
}];


// trip controller 
var tripCtrl = ['$scope', '$location', 'DataService', function ($scope, $location, DataService) {

	// check that we really have data 
	if ( ! DataService.hasData() ) {

		// if not go to root 
		$location.path('/');

	} else {

		// or else process the data
		$scope.tripData = DataService.getData();
		$scope.tripStops = $scope.tripData.towns;
		$scope.tripDistance = Math.floor($scope.tripData.distance / 1609);
		$scope.tripCities = $scope.tripData.towns.length;
		$scope.tripMap = "https://maps.google.com/maps?f=d&hl=en&ie=UTF8&q=" + $scope.tripData.googleMaps;
	}

}];

