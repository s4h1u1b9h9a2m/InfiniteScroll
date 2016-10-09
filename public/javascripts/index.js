angular.module('infinitescroll', ['ngMaterial'])

.controller('TitleController', function($scope) {
  $scope.title = 'Infinite Scroll';
})
.controller('AppCtrl', function($scope, $http) {

  this.infiniteItems = {
    numLoaded_: 0,
    toLoad_: 0,
    items: [],

    // Required.
    getItemAtIndex: function (index) {
        if (index > this.numLoaded_) {
            this.fetchMoreItems_(index);
            return null;
        }
        return this.items[index];
    },

    // Required.
    getLength: function () {
        return this.numLoaded_ + 10;
    },

    fetchMoreItems_: function (index) {
        if (this.toLoad_ < index) {
            this.toLoad_ += 10;

            $http.get("/products").then(angular.bind(this, function (obj) {

                //Array.prototype.push.apply(this.items, obj);
                this.items = this.items.concat(obj.data);
                this.numLoaded_ = this.toLoad_;
            }));

        }
    }
  };

});
