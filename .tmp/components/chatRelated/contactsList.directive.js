'use strict';

angular.module('chatApp').directive('contactsList', function () {
  return {
    templateUrl: 'components/chatRelated/contactsList.html',
    restrict: 'E',
    controller: 'ContactsListController',
    controllerAs: 'contactsList'
  };
});
//# sourceMappingURL=contactsList.directive.js.map
