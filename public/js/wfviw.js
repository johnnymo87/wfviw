'use strict';

var app = angular.module('wfviw', ['ngResource', 'ngRoute']);

app.factory('DeployService', function($resource) {
  return $resource('/deploy');
});

app.controller('DeployCtrl', function($scope, DeployService) {
  //
});
