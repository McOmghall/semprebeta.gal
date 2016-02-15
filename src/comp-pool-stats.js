require('angular'); /*global angular*/
angular.module('compPoolStats', [])
  .constant('compPoolStatsConstants', {
    statuses: {
      idle: "IDLE",
      connecting: "CONNECTING",
      ok: "OK",
      error: "ERROR"
    }
  })
  .factory('compPoolStats', ['compPoolStatsConstants',
    function(compPoolStatsConstants) {

      return {
        status: compPoolStatsConstants.statuses.idle,
        instantiationTime: Date.now(),
        jobs: 0,
        variables: 0,
        results: 0,
        timeOfFirstJob: null,
        oneMoreJob: function() {
          if (!this.timeOfFirstJob) {
            this.timeOfFirstJob = Date.now();
          }
          this.jobs += 1;
        },
        oneMoreVariable: function() {
          this.variables += 1;
        },
        oneMoreResult: function() {
          this.results += 1;
        },
        setStatusIdle: function() {
          this.status = compPoolStatsConstants.statuses.idle;
        },
        setStatusOk: function() {
          this.status = compPoolStatsConstants.statuses.ok;
        },
        setStatusError: function() {
          this.status = compPoolStatsConstants.statuses.error;
        },
        setStatusConnecting: function() {
          this.status = compPoolStatsConstants.statuses.connecting;
        },
        getCurrentStats: function() {
          var timeSpent = (this.timeOfFirstJob == null ? 0 : (Date.now() - this.timeOfFirstJob) / 1000);
          var resultsPerSecond = (this.timeOfFirstJob == null ? 0 : this.results / (timeSpent / 1000));
          return {
            status: this.status,
            statuses: compPoolStatsConstants.statuses,
            isError: function() {
              return this.status == this.statuses.error;
            },
            isOk: function() {
              return this.status == this.statuses.ok;
            },
            isIdle: function() {
              return this.status == this.statuses.idle;
            },
            isConnecting: function() {
              return this.status == this.statuses.connecting;
            },
            jobs: this.jobs,
            variables: this.variables,
            results: this.results,
            timeSpent: timeSpent,
            resultsPerSecond: resultsPerSecond
          }
        }
      }
    }
  ]);