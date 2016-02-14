require('angular'); /*global angular*/
require('angular-hypermedia');

angular.module('compPoolResources', ['hypermedia'])
  .factory('compPoolResources', ['compPoolRoot', "HalResource", "Resource", "ResourceContext", 
  function(compPoolRoot, HalResource, Resource, ResourceContext) {
    var profileURIs = {
      root: compPoolRoot + "/profiles/root",
      job: compPoolRoot + "/profiles/job",
      variable: compPoolRoot + "/profiles/variable",
      result: compPoolRoot + "/profiles/result"
    };
    
    Resource.registerProfile(profileURIs.root, {
      getJob: function(jobId) {
        var job = this.$linkRel(jobId).$get();
        job.$profile = profileURIs.job;
        return job;
      },
      getRandomJob: function() {
        return this.getJob(pickRandomProperty(this.$links));
      }
    });
    
    return {
      getRoot: function() {
        var root = new ResourceContext(HalResource).get(compPoolRoot).$get();
        root.$profile = profileURIs.root;
        return root;
      }
    }
  }]);
  

function pickRandomProperty(obj) {
  var result;
  var count = 0;
  for (var prop in obj) {
    if (Math.random () < 1 / ++count) {
      result = prop;
    }
  }
  return result;
};