window.$debug = undefined;

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

   var module = angular.module('ngMdMultiLevelMenu', ['ngMaterial', 'ngAnimate', 'ngMdIcons']);

   module.constant('STYLE', {
      REPLACE: 1,
      ACCORDION: 2
   });

   module.provider('menu', ['STYLE', '$injector', function(STYLE, $injector) {
      var $this = this;

      $this._id = Math.random().toString(36).substr(2, 5);
      $this._breadcrumb = true;
      $this._title = 'Menu';
      $this._back = 'Back';
      $this._style = 1;
      $this._items = {}; // [];
      $this._callback = undefined;
      $this.STYLE = STYLE;
      
      $this.$get = function() {
         return {
            id: $this._id,
            breadcrumb: $this._breadcrumb,
            title: $this._title,
            back: $this._back,
            style: $this._style,
            items: $this._items,
            callback: $this._callback
         };
      };

      $this.items = function(id, items) {
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
         $this._items[id] = items;
      };

      $this.id = function(id) {
         $this._id = id;
      };

      $this.title = function(title) {
         $this._title = title;
      };

      $this.back = function(back) {
         $this._back = back;
      };

      $this.breadcrumb = function(breadcrumb) {
         $this._breadcrumb = breadcrumb;
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
         return walk(menu.items[menu.id], function(item) {
            return item.id && item.id == id;
         });
      };
   }]);

   module.directive('mdMultiLevelMenu', ['$animate', '$location', '$menu', 'menu', 'STYLE', function($animate, $location, $menu, menu, STYLE) {
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
         controller: function($scope, $element) {
            var $this = this;

            $scope.select = function(item) {
               if (item.link) {
                  $location.path(item.link);
               }
               if (typeof menu.callback == 'function') {
                  menu.callback(item);
               }
            };
         
            $scope.reset = function() {
               console.log('stored id:', $scope.id);
               $scope.breadcrumb = menu.breadcrumb;
               $scope.style = menu.style;
               $scope.STYLE = STYLE;
               $scope.stack = [];
               $scope.current = {
                  label: $scope.title,
                  items: menu.items[$scope.id]
               };
            };
         
            $scope.click = function(item) {
               console.log($scope.id);
               if (item.items) {
                  if ($scope.style == STYLE.REPLACE) {
                     var widget = angular.element('md-list.menu#' + $scope.id);
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
               var widget = angular.element('md-list.menu#' + $scope.id);
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
               walk(menu.items[menu.id], function(item) {
                  item.expanded = false;
               });
               $scope.reset();
            });
         },
         templateUrl: template,
         scope: {},
         link: {
            pre: function(scope, element, attributes, controller) {
               console.log('link', attributes.id);
               scope.id = attributes.id || Math.random().toString(36).substr(2, 5);
               scope.title = attributes.mdTitle || 'Menu';
               scope.previous = attributes.mdBack || 'Back';
               scope.breadcrumb = $boolean(attributes.mdBreadcrumb); 
               //controller.id = attributes.id || Math.random().toString(36).substr(2, 5);
               //controller.title = attributes.mdTitle || 'Menu';
               //controller.previous = attributes.mdBack || 'Back';
               //controller.breadcrumb = $boolean(attributes.mdBreadcrumb); 
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
                     //controller.style = STYLE[style];
                  } else {
                     console.warn('unknown style', style);
                  }
               }
            }
         }
      };
   }]);
})(window, window.angular, undefined);
