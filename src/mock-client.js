require('angular'); /*global angular*/
require('./comp-pool-stats');
require('./comp-pool-resources');
require('./comp-pool-exception-handler');

angular.module('compPoolJsClient', ['compPoolStats', 'compPoolResources', 'compPoolExceptionHandler'])
  .factory('compPoolJsClient', ['compPoolRoot', 'compPoolStats', 'compPoolResources', 'compPoolHttpExceptions', '$log',
    function(compPoolRoot, compPoolStats, compPoolResources, compPoolHttpExceptions, $log) {
      return {
        compPoolRoot: compPoolRoot,
        getStats: function() {
          return compPoolStats.getCurrentStats();
        },
        start: function() {
          $log.debug("Starting compPoolJsClient");
          compPoolStats.setStatusConnecting();
          return this;
        },
        stop: function() {
          $log.debug("Stopping compPoolJsClient");
          compPoolStats.setStatusIdle();
          return this;
        },
        getRoot: function() {
          $log.debug("Triying to get root at service " + compPoolRoot);
          if (!this.getStats().isConnecting() && !this.getStats().isOk()) {
            $log.debug("Service not initialized properly");
            throw new NotStartedException();
          }

          return compPoolResources.getRoot().then(function(result) {
            $log.debug("Got root correctly: " + JSON.stringify(result));
            compPoolStats.setStatusOk();
            return result;
          }).catch(function(error) {
            compPoolStats.setStatusError();
            throw new compPoolHttpExceptions.HttpException(compPoolRoot, error.status);
          });
        }
      };
    }
  ]);

function NotStartedException() {
  this.message = "comp-pool client not started, must use client.start() beforehand";
  this.name = "UserException";
};
