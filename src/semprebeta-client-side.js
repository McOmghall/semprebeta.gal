require('angular'); /*global angular*/
require('./mock-client');

var app = angular.module('SemprebetaApp', ['compPoolJsClient']);
app.value('compPoolRoot', 'http://semprebeta.gal:7070/jobs');

app.controller('JobsCtrl', ['$scope', '$http', '$timeout', '$log', 'compPoolJsClient',
  function($scope, $http, $timeout, $log, compPoolJsClient) {
    
    $scope.stats = compPoolJsClient.getStats;
    $scope.job = {};

    var jobLoop = function() {
      $log.debug('Rolling job');
      $scope.job.getRandomVariable().compute().storeAsResult();
      if ($scope.stats().isOk()) {
        $timeout(jobLoop, 100);
      }
    };

    $scope.deactivate = function() {
      $log.debug('Deactivating');
      compPoolJsClient.stop();
    };

    $scope.activate = function() {
      $log.debug('Activating');
      try {
        $scope.job = compPoolJsClient.start().getRoot().getRandomJob();
        jobLoop();
      } catch (e) {
        $scope.errorMessage = ": " + e.message;
      }
    };
    
  }
]);
