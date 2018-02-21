# angular-material-multilevel-menu

Material Multi-Level Menu for AngularJS

## Demo

View [online demo](https://jmouriz.github.io/angular-material-multilevel-menu/demo/demo.html)

## Main features

- Breadcrumb
- Interface with angular-route if available

## Install

Download the package:

```
yarn add angular-material-multilevel-menu
```

## Usage

In your document head, include:

```html
<link rel="stylesheet" href="node_modules/angular-material-multilevel-menu/angular-material-multilevel-menu.min.css" />
```

Use the md-multi-level-menu where you wish:

```html
<md-multi-level-menu md-title="Menu"
                     md-back="Back"
                     md-style="replace">
</md-multi-level-menu>
```

Then, just before close body tag, include:

```html
<script src="node_modules/angular-material-multilevel-menu/angular-material-multilevel-menu.min.js"></script>
```

Include the module in your application:

```javascript
var application = angular.module('Application', ['ngMdMultiLevelMenu']);
```

Configure the items:

```javascript
application.config(['menuProvider', function(menuProvider) {
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
      hidden: false
   }]);
}]);
```

Finally, in your controller, configure the select callback of $menu service to handle the links:

```javascript
application.controller('Controller', ['$menu', function($menu) {
   $menu.callback(function(item) {
      console.log('You are going to', item.link);
   });
}]);
```
