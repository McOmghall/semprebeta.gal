require('angular') /*global angular*/

angular.module('compPoolExceptionHandler', [])
  .factory('compPoolHttpExceptions',
    function() {
      return {
        HttpException: HttpException
      }
    });

function HttpException(server, errorCode) {
  if (errorCode == null || errorCode <= 0) {
    return new NoConnectionException(server, errorCode);
  }

  return new HttpTypeException(server, errorCode);
}

function HttpTypeException(server, errorCode) {
  this.message = "Server " + server + " can't respond. Response error code: " + errorCode;
}

function NoConnectionException(server, errorCode) {
  this.message = "Your connection is down or the server at " + server + " can't respond. Response error code: " + errorCode;
}
