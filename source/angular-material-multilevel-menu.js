(function(window, angular, undefined) {
   'use strict';

   var module = angular.module('ngMdMultiLevelMenu', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'ngMdBadge']);

   module.provider('menu', ['$injector', function($injector) {
		this._breadcrumb = true;
		this._title = 'Menu';
		this._back = 'Back';
		this._items = [];

      this.$get = function() {
         return {
            breadcrumb: this._breadcrumb,
            title: this._title,
            back: this._back,
            items: this._items
         };
      };

		this.breadcrumb = function(breadcrumb) {
			this._breadcrumb = breadcrumb;
      };

		this.items = function(items) {
         var route;
         try {
            route = angular.module("ngRoute");
         } catch(error) {
            route = undefined;
         }
         if (route) {
            var provider = $injector.get('$routeProvider');
            var walk = function(items) {
               for (var each in items) {
                  var item = items[each];
                  if (item.view || item.controller) {
                     var target = {
                        templateUrl: (item.view || item.link) + '.html'
                     };
                     if (item.controller) {
                        target.controller = item.controller;
                     }
                     provider.when('/' + item.link, target);
                  }
                  walk(items[item].items);
               }
            }
         }
			this._items = items;
		};

		this.title = function(title) {
			this._title = title;
		};

		this.back = function(back) {
			this._back = back;
		};
   }]);

   module.service('$menu', ['menu', function(menu) {
      this.breadcrumb = function(breadcrumb) {
         if (breadcrumb == undefined) {
            return menu.breadcrumb;
         }
         menu.breadcrumb = breadcrumb;
      };

      this.select = function(link) {
         console.warn('You must provide $menu.select handler');
      };
   }]);

   module.controller('MenuController', ['$scope', '$animate', '$menu', 'menu', function($scope, $animate, $menu, menu) {
      $scope.select = function(item) {
         if (item.link) {
            $menu.select(item.link);
         }
      };
   
      $scope.reset = function() {
		   $scope.breadcrumb = menu.breadcrumb;
		   $scope.previous = menu.back;
         $scope.stack = [];
         $scope.current = {
            label: menu.title,
            items: menu.items
         };
      };
   
      $scope.click = function(item) {
         if (item.items) {
            var widget = angular.element('md-list.menu');
            $animate.addClass(widget, 'left').then(function() {
               $scope.stack.push($scope.current);
               $scope.current = {
                  label: item.label,
                  items: item.items
               };
               widget.removeClass('ng-animate');
               widget.removeClass('left');
               widget.addClass('right');
               widget.addClass('ng-animate');
               $animate.removeClass(widget, 'right');
            });
         }
         $scope.select(item);
      };
   
      $scope.back = function(index) {
         var left = $scope.stack.length - index;
         var widget = angular.element('md-list.menu');
         $animate.addClass(widget, 'right').then(function() {
            do var previous = $scope.stack.pop();
            while (--left);
            $scope.current = previous;
            widget.removeClass('ng-animate');
            widget.removeClass('right');
            widget.addClass('left');
            widget.addClass('ng-animate');
            $animate.removeClass(widget, 'left');
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
