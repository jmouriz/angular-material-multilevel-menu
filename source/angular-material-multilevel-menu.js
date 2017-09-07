(function(window, angular, undefined) {
   'use strict';

   var module = angular.module('ngMdMultiLevelMenu', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'ngMdBadge']);

   module.constant('STYLE', {
      REPLACE: 1,
      ACCORDION: 2
   });

   module.provider('menu', ['STYLE', '$injector', function(STYLE, $injector) {
		this._breadcrumb = true;
		this._title = 'Menu';
		this._back = 'Back';
		this._style = 1;
		this._items = [];
      this.STYLE = STYLE;
      
      this.$get = function() {
         return {
            breadcrumb: this._breadcrumb,
            title: this._title,
            back: this._back,
            style: this._style,
            items: this._items
         };
      };

		this.breadcrumb = function(breadcrumb) {
			this._breadcrumb = breadcrumb;
      };

		this.items = function(items) {
         try {
            var router = $injector.get('$routeProvider');
            var walk = function(items) {
               for (var each in items) {
                  var item = items[each];
                  if (item.link) {
                     var target = {
                        templateUrl: (item.view || item.link) + '.html'
                     };
                     if (item.controller) {
                        target.controller = item.controller;
                     }
                     router.when('/' + item.link, target);
                  }
                  walk(item.items);
               }
            }
            walk(items);
            if (items.length) {
               router.otherwise({
                  redirectTo: '/' + items[0].link
               });
            }
         } catch(error) {
            // pass
         }
			this._items = items;
		};

		this.title = function(title) {
			this._title = title;
		};

		this.back = function(back) {
			this._back = back;
		};

		this.style = function(style) {
			this._style = style;
		};
   }]);

   module.service('$menu', ['menu', 'STYLE', function(menu, STYLE) {
      this.STYLE = STYLE;

      this.breadcrumb = function(breadcrumb) {
         if (breadcrumb == undefined) {
            return menu.breadcrumb;
         }
         menu.breadcrumb = breadcrumb;
      };

      this.style = function(style) {
         menu.style = style;
      }
   }]);

   module.controller('MenuController', ['$scope', '$animate', '$location', '$menu', 'menu', 'STYLE', function($scope, $animate, $location, $menu, menu, STYLE) {
      $scope.select = function(item) {
         if (item.link) {
            $location.path(item.link);
         }
      };
   
      $scope.reset = function() {
		   $scope.breadcrumb = menu.breadcrumb;
		   $scope.previous = menu.back;
		   $scope.style = menu.style;
		   $scope.STYLE = STYLE;
         $scope.stack = [];
         $scope.current = {
            label: menu.title,
            items: menu.items
         };
      };
   
      $scope.click = function(item) {
         if (item.items) {
            if ($scope.style == STYLE.REAPLCE) {
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
            if ($scope.style == STYLE.ACCORDION) {
               item.expanded = !item.expanded;
            }
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
