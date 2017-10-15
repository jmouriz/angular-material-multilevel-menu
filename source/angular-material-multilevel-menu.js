(function(window, angular, undefined) {
   'use strict';

   var walk = function(items, callback) {
      for (var each in items) {
         var item = items[each];
         if (callback(item)) {
            return item;
         }
         item = walk(item.items, callback);
         if (item) {
            return item;
         }
      }
   };

   var $boolean = function(variable) {
      return (typeof variable === 'string' && variable === 'true');
   };

   var module = angular.module('ngMdMultiLevelMenu', ['ngMaterial', 'ngAnimate', 'ngMdIcons', 'ngMdBadge']);

   module.constant('STYLE', {
      REPLACE: 1,
      ACCORDION: 2
   });

   module.provider('menu', ['STYLE', '$injector', function(STYLE, $injector) {
      var $this = this;

      $this._breadcrumb = true;
      $this._title = 'Menu';
      $this._back = 'Back';
      $this._style = 1;
      $this._items = [];
      $this._callback = undefined;
      $this.STYLE = STYLE;
      
      $this.$get = function() {
         return {
            breadcrumb: $this._breadcrumb,
            title: $this._title,
            back: $this._back,
            style: $this._style,
            items: $this._items,
            callback: $this._callback
         };
      };

      $this.breadcrumb = function(breadcrumb) {
         $this._breadcrumb = breadcrumb;
      };

      $this.items = function(items) {
         try {
            var router = $injector.get('$routeProvider');
            walk(items, function(item) {
               if (item.link) {
                  var target = {
                     templateUrl: (item.view || item.link) + '.html'
                  };
                  if (item.controller) {
                     target.controller = item.controller;
                  }
                  router.when('/' + item.link, target);
               }
            });
            if (items.length) {
               router.otherwise({
                  redirectTo: '/' + items[0].link
               });
            }
         } catch (error) {
            // pass
         }
         $this._items = items;
      };

      $this.title = function(title) {
         $this._title = title;
      };

      $this.back = function(back) {
         $this._back = back;
      };

      $this.style = function(style) {
         $this._style = style;
      };

      $this.callback = function(callback) {
         $this._callback = callback;
      };
   }]);

   module.service('$menu', ['menu', 'STYLE', '$rootScope', function(menu, STYLE, $rootScope) {
      var $this = this;

      $this.STYLE = STYLE;

      $this.walk = walk;

      $this.breadcrumb = function(breadcrumb) {
         if (breadcrumb == undefined) {
            return menu.breadcrumb;
         }
         menu.breadcrumb = breadcrumb;
      };

      $this.style = function(style) {
         if (style == undefined) {
            return menu.style;
         }
         menu.style = style;
         $rootScope.$broadcast('reset');
      };

      $this.callback = function(callback) {
         if (callback == undefined) {
            return menu.callback;
         }
         menu.callback = callback;
      };

      $this.get = function(id) {
         return walk(menu.items, function(item) {
            return item.id && item.id == id;
         });
      };
   }]);

   module.controller('MenuController', ['$scope', '$animate', '$location', '$menu', 'menu', 'STYLE', function($scope, $animate, $location, $menu, menu, STYLE) {
      $scope.select = function(item) {
         if (item.link) {
            $location.path(item.link);
            if (typeof menu.callback == 'function') {
               menu.callback();
            }
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
            if ($scope.style == STYLE.REPLACE) {
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

      $scope.$on('reset', function(event) {
         walk(menu.items, function(item) {
            item.expanded = false;
         });
         $scope.reset();
      });
   }]);
   
   module.directive('mdMultiLevelMenu', ['STYLE', function(STYLE) {
      var scripts = angular.element('script'), script;
      for (var each in scripts) {
         script = scripts[each];
         if (script.src && script.src.match(/angular-material-multilevel-menu(\.min)?\.js$/)) {
            break;
         }
      }
      var template = script.src.replace(/\.js$/, '.html');
      return {
         restrict: 'E',
         replace: true,
         controller: 'MenuController',
         templateUrl: template,
         link: function(scope, elemement, attributes) {
            scope.title = attributes.mdTitle || 'Main';
            scope.previous = attributes.mdBack;
            scope.breadcrumb = $boolean(attributes.mdBreadcrumb); 
            var style = undefined;
            for (var attribute in attributes) {
               if (attribute.startsWith('mdStyle')) {
                  style = attribute.replace(/^mdStyle/, '').toUpperCase();
                  break;
               }
            }
            if (style) {
               if (STYLE[style]) {
                  scope.style = STYLE[style];
               } else {
                  console.warn('unknown style', style);
               }
            }
         }
      };
   }]);
})(window, window.angular, undefined);
