'use strict';

angular.module('chatApp')
  .directive('contactsList', () => ({
    templateUrl: 'components/chatRelated/contactsList.html',
    restrict: 'E',
    controller: 'ContactsListController',
    controllerAs: 'contactsList'
  }));
