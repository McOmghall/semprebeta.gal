require('angular') /*global angular*/
require('comp-pool')

angular.module('SemprebetaApp', ['CompPoolClient'])
  .factory('compPoolRoot', ['$log', function ($log) {
    var rootDefault = 'http://localhost:7070/'
    $log.debug('Getting value for comp-pool root %s (fall back to %s)', process.env.COMP_POOL_ROOT, rootDefault)
    return process.env.COMP_POOL_ROOT || rootDefault
  }])
  .controller('JobsCtrl', ['$scope', '$http', '$timeout', '$log', '$q', 'compPoolClient',
    function ($scope, $http, $timeout, $log, $q, compPoolClient) {
      $scope.job = {}

      $scope.statuses = {
        ok: 'OK',
        idle: 'IDLE',
        connecting: 'CONNECTING',
        error: 'ERROR'
      }
      $scope.status = $scope.statuses.idle
      $scope.stats = {}
      $scope.stats.results = 0

      var jobLoop = function (job) {
        $log.debug('Rolling job %j', job)
        job.getVariablesRoot().then(function (variablesRoot) {
          $log.debug('Getting random variable with %j', variablesRoot)
          return variablesRoot.getRandomVariable()
        }).then(function (variable) {
          $log.debug('Computing with variable %j', variable)
          return variable.compute()
        }).then(function (variableWithResult) {
          $log.debug('Saving variable %j', variableWithResult)
          $scope.stats.results++
          $scope.stats.timeSpent = (new Date().getTime() - $scope.firstJob.getTime()) / 1000
          $scope.stats.resultsPerSecond = $scope.stats.results / $scope.stats.timeSpent
          variableWithResult.saveResult({asVariableToo: true})

          if ($scope.status === $scope.statuses.ok) {
            $log.debug('Calling a new job')
            $timeout(jobLoop, 100, true, job)
          }
        }).catch(function (err) {
          $log.error('Something happened! %j', err)
          $scope.status = $scope.statuses.error
        })
      }

      $scope.deactivate = function () {
        $log.debug('Deactivating')
        $scope.status = $scope.statuses.idle
      }

      $scope.activate = function () {
        $log.debug('Activating %j', compPoolClient)

        var pq = compPoolClient.getJobsRoot().then(function (root) {
          $log.debug('Got root %j', root)
          $scope.status = $scope.statuses.ok
          return root.getRandomJob()
        }).then(function (job) {
          $log.debug('Got job %j', job)
          $scope.firstJob = new Date()
          jobLoop(job)
          return job
        }).catch(function (err) {
          $log.error('Something happened! %j', err)
          $scope.status = $scope.statuses.error
        })

        $log.debug('Activated %j', pq)
      }
    }
  ])
