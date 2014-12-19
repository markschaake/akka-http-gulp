'use strict';

var angular = require('angular');

var mod = angular.module('config', []);
mod.constant('API_URL', '/api/1');

module.exports = mod.name;
