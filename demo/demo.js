var demo = angular.module('Demo', ['ngMaterial', 'ngMdMultiLevelMenu']);

demo.config(['menuProvider', function(menuProvider) {
   menuProvider.set([{
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
   }]);
}]);
