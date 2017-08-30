(function(window, angular, undefined) {
   'use strict';
   
   angular.module('ngMdMultiLevelMenu', ['ngMaterial', 'ngAnimate', 'ngMdIcons']).directive('mdMultiLevelMenu', [function() {
      return {
         restrict: 'E',
         replace: true,
         transclude: true,
         template: function(element, attributes) {
            return '<div ng-transclude></div>';
         }
      };
   }]);
})(window, window.angular, undefined);
