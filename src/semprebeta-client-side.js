require('angular');

var app = angular.module("SemprebetaApp", []);
app.value("compPoolRoot", "http://semprebeta.gal:7070/jobs");
require('./mock-client').addToModule(app);
app.controller("JobsCtrl", ["$scope", "$http", "$timeout", "$log", "compPoolJsClient",
  function($scope, $http, $timeout, $log, compPoolJsClient) {
    $scope.active = false;
    $scope.stats = compPoolJsClient.getStats();
    $scope.job = {};

    var jobUpdate = function() {
      compPoolJsClient.getARandomVariable($scope.job).compute().storeAsResult();
      $scope.stats = compPoolJsClient.getStatsForJob($scope.job);
      if ($scope.active) {
        $timeout(jobUpdate, 100);
      }
    };

    $scope.deactivate = function() {
      $scope.active = false;
    }

    $scope.activate = function() {
      $scope.active = true;
      $log.debug("Calling at root: " + compPoolJsClient.compPoolRoot);
      $scope.job = compPoolJsClient.getARandomJob();
      jobUpdate();
    };
  }
]);
