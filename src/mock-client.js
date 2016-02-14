require('angular'); /*global angular*/
require('./comp-pool-stats');
require('./comp-pool-resources');

angular.module('compPoolJsClient', ['compPoolStats', 'compPoolResources'])
  .factory('compPoolJsClient', ['compPoolRoot', 'compPoolStats', 'compPoolResources', '$log',
    function(compPoolRoot, compPoolStats, compPoolResources, $log) {
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
          if (!this.getStats().isConnecting() && !this.getStats().isOk()) {
            throw new NotStartedException();
          }

          try {
            var rval;
            compPoolResources.getRoot().then(function(e) {
                rval = e;
              },
              function(e) {
                throw e;
              });
            compPoolStats.setStatusOk();
            return rval;
          }
          catch (e) {
            compPoolStats.setStatusError();
            throw e;
          }
        }
      };
    }
  ]);

function NotStartedException() {
  this.message = "comp-pool client not started, must use client.start() beforehand";
  this.name = "UserException";
};