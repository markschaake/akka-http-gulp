'use strict';

var AuthService = function(API_URL) {
  console.log(API_URL);
  this.user = "You!";
};

module.exports = ['API_URL', AuthService];
