(function() {
  'use strict';

  var Promise = require('promise');

  var newRequest = function(method, url, body) {
    return new Promise(function(fullfill, reject) {
      var request = new XMLHttpRequest();
      request.open(method, url);
      request.responseType = 'json';

      if (typeof body === 'object') {
        body = JSON.stringify(body);
        request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
      }

      request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status >= 200 && request.status <= 299) {
          fullfill(request.response);
        } else if (request.readyState == 4) {
          reject({
            request: request,
            status: request.status,
            statusText: request.statusText,
            response: request.response,
            responseURL: request.responseURL
          });
        }
      }
      request.send(body);
    });
  };

  module.exports = {
    get: function(url) {
      return newRequest('GET', url);
    },
    post: function(url, body) {
      return newRequest('POST', url, body);
    },
    put: function(url, body) {
      return newRequest('PUT', url, body);
    }
  };
})();
