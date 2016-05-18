'use strict';

(function() {

class MainController {

  constructor($scope, Auth) {
    Auth.logout();
    $(".lean-overlay").hide();
  }
}

angular.module('chatApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
