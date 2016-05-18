'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function MainController($scope, Auth) {
    _classCallCheck(this, MainController);

    Auth.logout();
    $(".lean-overlay").hide();
  };

  angular.module('chatApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });
})();
//# sourceMappingURL=main.controller.js.map
