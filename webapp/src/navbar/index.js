'use strict';

var angular = require('angular');

module.exports = angular
  .module('navbar', [require('../auth')])
  .directive('navbar', require('./navbar-directive'))
  .name;
