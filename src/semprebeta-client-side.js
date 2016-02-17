require('angular'); /*global angular*/
require('./mock-client');

var app = angular.module('SemprebetaApp', ['compPoolJsClient']);
app.value('compPoolRoot', 'http://semprebeta.gal:7070/jobs');

app.controller('JobsCtrl', ['$scope', '$http', '$timeout', '$log', 'compPoolJsClient',
  function($scope, $http, $timeout, $log, compPoolJsClient) {

    $scope.stats = compPoolJsClient.getStats;
    $scope.job = {};

    var jobLoop = function(job) {
      $log.debug('Rolling job');
      job.getRandomVariable().compute().storeAsResult();
      if ($scope.stats().isOk()) {
        $timeout(jobLoop, 100, true, job);
      }
    };

    $scope.deactivate = function() {
      $log.debug('Deactivating');
      compPoolJsClient.stop();
    };

    $scope.activate = function() {
      $log.debug('Activating');
      compPoolJsClient.start().getRoot().then(function(root) {
        root.getRandomJob().then(function(job) {
	  jobLoop();
	  return true;
	});
      }).catch(function(error) {
        $scope.errorMessage = ": " + error.message;
      });
    };
  }
]);
