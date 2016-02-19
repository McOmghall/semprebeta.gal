require('angular'); /*global angular*/
require('comp-pool-client');
var config = require('../semprebeta-config');

var app = angular.module('SemprebetaApp', ['CompPoolClient']);
app.factory('compPoolRoot', ['$location', function($location) {
   var compPoolHost = config.compPoolHost;
   if (compPoolHost == 'localhost' && $location.host() != 'localhost') {
     compPoolHost = $location.host();
   }
   
   return config.compPoolProtocol + compPoolHost + ":" + config.compPoolPort + config.compPoolRoot;
}]);

app.controller('JobsCtrl', ['$scope', '$http', '$timeout', '$log', 'compPoolClient',
  function($scope, $http, $timeout, $log, compPoolClient) {

    $scope.stats = compPoolClient.getStats;
    $scope.job = {};

    $scope.statuses = {
      ok: "OK",
      idle: "IDLE",
      connecting: "CONNECTING",
      error: "ERROR"
    };
    $scope.status = $scope.statuses.idle;

    var jobLoop = function(job) {
      $log.debug('Rolling job');
      job.getRandomVariable().compute().storeAsResult();
      if ($scope.status == $scope.statuses.ok) {
        $timeout(jobLoop, 100, true, job);
      }
    };

    $scope.deactivate = function() {
      $log.debug('Deactivating');
      $scope.status = $scope.statuses.idle;
    };

    $scope.activate = function() {
      $log.debug('Activating');

      compPoolClient.then(function(api) {
	$log.debug('Trying to get root');
        $scope.status = $scope.statuses.connecting;
	return api.getRoot();
      }).then(function(root) {
	$log.debug('Got root');
        $scope.status = $scope.statuses.ok;
	return root.getRandomJob();
      }).then(function(job) {
	$log.debug('Initiating job loop');
        jobLoop(job);
	return job;
      }).catch(function(error) {
        $scope.errorMessage = ": " + (error.message || "Could not connect to server");
        $scope.status = $scope.statuses.error;
      });
    };
  }
]);
