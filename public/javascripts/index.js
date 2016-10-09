angular.module('infinitescroll', ['ngMaterial'])

.controller('TitleController', function($scope) {
  $scope.title = 'Infinite Scroll';
})
.controller('AppCtrl', function($scope) {

  $scope.todos = [];
  for (var i = 0; i < 15; i++) {
    $scope.todos.push({
      what: "Brunch this weekend?",
      who: "Min Li Chan",
      notes: "I'll be in your neighborhood doing errands."
    });
  }

});
