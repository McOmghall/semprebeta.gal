module.exports.addToModule = function(module) {
  module.factory("compPoolStats", [

      function() {
        return {
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
          getCurrentStats: function() {
            var timeSpentMs = Date.now() - this.timeOfFirstJob;
            return {
              jobs: this.jobs,
              variables: this.variables,
              results: this.results,
              timeSpent: timeSpentMs / 1000,
              resultsPerSecond: this.results / (timeSpentMs / 1000)
            }
          }
        };
      }
    ])
    .factory("compPoolJsClient", ["compPoolRoot", "compPoolStats",
      function(compPoolRoot, compPoolStats) {
        return {
          compPoolRoot: compPoolRoot,
          getStats: function() {
            return compPoolStats.getCurrentStats();
          }
        };
      }
    ]);
};
