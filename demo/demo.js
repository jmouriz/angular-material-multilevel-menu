var demo = angular.module('Demo', ['ngMaterial', 'ngMdMultiLevelMenu', 'hc.marked']);

demo.config(['menuProvider', function(menuProvider) {
   menuProvider.title('Main');

   menuProvider.items([{
      label: 'Item 1',
      icon: 'amazon',
      items: [{
         label: 'Item 1.1',
         link: 'item-1-1',
         icon: 'apple'
      }, {
         label: 'Item 1.2',
         link: 'item-1-2',
         icon: 'facebook'
      }]
   }, {
      label: 'Item 2',
      link: 'item-2',
      icon: 'windows'
   }, {
      label: 'Item 3',
      icon: 'google-plus',
      items: [{
         label: 'Item 3.1',
         link: 'item-3-1',
         icon: 'twitter'
      }, {
         label: 'Item 3.2',
         icon: 'github-box',
         items: [{
            label: 'Item 3.2.1',
            link: 'item-3-2-1',
            icon: 'whatsapp'
         }, {
            label: 'Item 3.2.2',
            icon: 'office',
            items: [{
               label: 'Item 3.2.2.1',
               link: 'item-3-2-2-1',
               icon: 'hangouts'
            }]
         }]
      }]
   }, {
      label: 'Item 4',
      link: 'item-4',
      icon: 'linkedin'
   }]);
}]);

demo.config(['markedProvider', function(markedProvider) {
   markedProvider.setOptions({
      gfm: true,
      tables: true,
      highlight: function(code, language) {
         console.log(language);
         if (!language) {
            language = 'bash';
         } else if (language == 'html') {
            language = 'markup';
         }
         return Prism.highlight(code, Prism.languages[language]);
      }
   });
}]);

demo.controller('Demo', ['$scope', '$menu', '$mdSidenav', '$mdToast', function($scope, $menu, $mdSidenav, $mdToast) {
   $scope.breadcrumb = $menu.breadcrumb();

   $scope.toggle = function() {
      $mdSidenav('left').toggle();
      $scope.icon = $scope.icon == 'menu' ? 'close' : 'menu';
   };

   $mdSidenav('left', true).then(function(instance) {
      $scope.icon = 'menu';
      instance.onClose(function () {
         $scope.icon = 'menu';
      });
   });

   $scope.$watch('breadcrumb', function(value) {
      $menu.breadcrumb(value);
   });

   $menu.select = function(link) {
      var toast = $mdToast.simple();
      toast.textContent('You have chosen item "' + link + '"');
      $mdToast.show(toast.hideDelay(3000));
   }
}]);
