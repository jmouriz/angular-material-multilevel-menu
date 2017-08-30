var demo = angular.module('Demo', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'ngMdMultiLevelMenu']);

demo.controller('Demo', ['$scope', '$animate', function($scope, $animate) {

   $scope.menu = [{
      item: 'Item 1',
      menu: [{
         item: 'Item 1'
      }, {
         item: 'Item 2'
      }]
   }, {
      item: 'Item 2'
   }, {
      item: 'Item 3',
      menu: [{
         item: 'Item 1'
      }, {
         item: 'Item 2',
         menu: [{
            item: 'Item 1'
         }, {
            item: 'Item 2'
         }]
      }]
   }, {
      item: 'Item 4'
   }];

   $scope.select = function(item) {
      $scope.selected = item.item;
   };

   $scope.reset = function() {
      $debug = $animate;
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
