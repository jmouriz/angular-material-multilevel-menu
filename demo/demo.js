var demo = angular.module('Demo', ['ngMaterial', 'ngMdMultiLevelMenu', 'ngMdBadge', 'ngRoute', 'hc.marked']);

demo.config(['menuProvider', function(menuProvider) {
   menuProvider.items('primary', [{
      label: 'Documentation',
      icon: 'import_contacts',
      link: 'demo/readme',
      color: 'blue'
   }, {
      id: 'item-1',
      label: 'Item 1: 3',
      icon: 'amazon',
      items: [{
         label: 'Item 1.1',
         link: 'demo/views/item-1-1',
         icon: 'apple'
      }, {
         label: 'Item 1.2',
         link: 'demo/views/item-1-2',
         icon: 'facebook'
      }]
   }, {
      id: 'item-2',
      label: 'Item 2',
      link: 'demo/views/item-2',
      icon: 'windows',
      badge: 3
   }, {
      label: 'Item 3',
      icon: 'google-plus',
      items: [{
         label: 'Item 3.1',
         link: 'demo/views/item-3-1',
         icon: 'twitter'
      }, {
         label: 'Item 3.2',
         icon: 'github-box',
         items: [{
            label: 'Item 3.2.1',
            link: 'demo/views/item-3-2-1',
            icon: 'whatsapp'
         }, {
            label: 'Item 3.2.2',
            icon: 'office',
            items: [{
               label: 'Item 3.2.2.1',
               link: 'demo/views/item-3-2-2-1',
               icon: 'hangouts'
            }]
         }]
      }]
   }, {
      id: 'item-4',
      label: 'Item 4',
      link: 'demo/views/item-4',
      icon: 'linkedin'
   }]);

   menuProvider.items('secondary', [{
      label: 'Documentation X',
      icon: 'import_contacts',
      link: 'demo/readme',
      color: 'blue'
   }, {
      id: 'item-1',
      label: 'Item 1: 3',
      icon: 'amazon',
      items: [{
         label: 'Item 1.1',
         link: 'demo/views/item-1-1',
         icon: 'apple'
      }, {
         label: 'Item 1.2',
         link: 'demo/views/item-1-2',
         icon: 'facebook'
      }]
   }, {
      id: 'item-2',
      label: 'Item 2',
      link: 'demo/views/item-2',
      icon: 'windows',
      badge: 3
   }, {
      label: 'Item 3',
      icon: 'google-plus',
      items: [{
         label: 'Item 3.1',
         link: 'demo/views/item-3-1',
         icon: 'twitter'
      }, {
         label: 'Item 3.2',
         icon: 'github-box',
         items: [{
            label: 'Item 3.2.1',
            link: 'demo/views/item-3-2-1',
            icon: 'whatsapp'
         }, {
            label: 'Item 3.2.2',
            icon: 'office',
            items: [{
               label: 'Item 3.2.2.1',
               link: 'demo/views/item-3-2-2-1',
               icon: 'hangouts'
            }]
         }]
      }]
   }, {
      id: 'item-4',
      label: 'Item 4',
      link: 'demo/views/item-4',
      icon: 'linkedin'
   }]);
}]);

demo.config(['markedProvider', function(markedProvider) {
   markedProvider.setOptions({
      gfm: true,
      tables: true,
      highlight: function(code, language) {
         if (!language) {
            language = 'bash';
         } else if (language == 'html') {
            language = 'markup';
         }
         return Prism.highlight(code, Prism.languages[language]);
      }
   });
}]);

demo.controller('Demo', ['$scope', '$menu', '$mdSidenav', '$mdBottomSheet', function($scope, $menu, $mdSidenav, $mdBottomSheet) {
   $scope.breadcrumb = $menu.breadcrumb();
   $scope.style = $menu.style();
   //$scope.count = $menu.get('item-2').badge;

   $scope.toggle = function() {
      $mdSidenav('left').toggle();
      $scope.icon = $scope.icon == 'menu' ? 'close' : 'menu';
   };

   $scope.test = function() {
      var item = $menu.get('item-4');
      if (item.items) {
         item.items = undefined;
      } else {
         item.items = [{
            label: 'Item 4.1',
            link: 'demo/views/item-4-1',
            icon: 'favorite'
         }, {
            label: 'Item 4.2',
            link: 'demo/views/item-4-2',
            icon: 'grade'
         }]
      }
   };

   $scope.menu = function() {
      $mdBottomSheet.show({
         templateUrl: 'bottom-sheet-template',
         controller: function($scope) {}
      });
   };

   $menu.callback(function(item) {
      console.log('You are going to', item.link);
      $scope.toggle();
      $mdBottomSheet.hide();
   });

   $mdSidenav('left', true).then(function(instance) {
      $scope.icon = 'menu';
      instance.onClose(function () {
         $scope.icon = 'menu';
      });
   });

   $scope.$watch('count', function(value) {
      //$menu.get('item-2').badge = $scope.count;
      //$menu.get('item-1').label = 'Item 1: ' + $scope.count;
   });

   $scope.$watch('breadcrumb', function(value) {
      $menu.breadcrumb(value);
   });

   $scope.$watch('style', function(value) {
      $menu.style(value);
   });
}]);
