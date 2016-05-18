'use strict';

angular.module('chatApp.auth', [
  'chatApp.constants',
  'chatApp.util',
  'ngCookies',
  'ui.router'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
