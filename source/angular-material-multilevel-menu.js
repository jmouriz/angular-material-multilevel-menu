(function(window, angular, undefined) {
   'use strict';

   var module = angular.module('ngMdMultiLevelMenu', ['ngMaterial', 'ngAnimate', 'ngMdIcons']);

   module.provider('menu', function() {
		this.menu = [];

      this.$get = function() {
         return this.menu;
      };

		this.set = function(menu) {
			this.menu = menu;
		};
   });

   module.controller('MenuController', ['$scope', '$animate', 'menu', function($scope, $animate, menu) {
      $scope.menu = menu;

      $scope.select = function(item) {
         $scope.selected = item.item;
      };
   
      $scope.reset = function() {
         $scope.stack = [];
         $scope.current = {
            item: 'Menú principal',
            menu: $scope.menu
         };
      };
   
      $scope.click = function(item) {
         if (item.menu) {
            var menu = angular.element('div.menu');
            $animate.addClass(menu, 'left').then(function() {
               $scope.stack.push($scope.current);
               $scope.current = {
                  item: item.item,
                  menu: item.menu
               }
               menu.removeClass('ng-animate');
               menu.removeClass('left');
               menu.addClass('right');
               menu.addClass('ng-animate');
               $animate.removeClass(menu, 'right');
            });
         }
         $scope.select(item);
      };
   
      $scope.back = function(index) {
         var left = $scope.stack.length - index;
         do var previous = $scope.stack.pop();
         while (--left);
         var menu = angular.element('div.menu');
         $animate.addClass(menu, 'right').then(function() {
            $scope.current = previous;
            menu.removeClass('ng-animate');
            menu.removeClass('right');
            menu.addClass('left');
            menu.addClass('ng-animate');
            $animate.removeClass(menu, 'left');
         });
      };
   }]);
   
   module.directive('mdMultiLevelMenu', [function() {
      return {
         restrict: 'E',
         replace: true,
         controller: 'MenuController',
         templateUrl: 'angular-material-multilevel-menu.min.html'
      };
   }]);
})(window, window.angular, undefined);
