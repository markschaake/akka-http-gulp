'use strict';

var angular = require('angular');
var mod = angular.module('auth', [require('../config')]);
mod.service('AuthService', require('./auth-service'));

module.exports = mod.name;
