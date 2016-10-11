angular.module('infinitescroll', ['ngMaterial', 'vcRecaptcha'])

.controller('TitleController', function($scope) {
  $scope.title = 'Infinite Scroll';
})
.controller('AppCtrl', function($scope, $http, vcRecaptchaService, $mdDialog) {

  /* Dialog for Recaptcha */

  $scope.blockViewCaptcha = function(ev) {
    $mdDialog.show({
      controller: DialogController,
      template:
        '<md-toolbar>'                                +
        '  <div class="md-toolbar-tools">'            +
        '    <h2>Please Verify yourself as Human</h2>'+
        '  </div>'                                    +
        '</md-toolbar>'                               +
        '<form ng-submit="submit()">'                 +
        '<div'                                        +
        '        vc-recaptcha'                        +
        '        theme="\'light\'"'                   +
        '        key="model.key"'                     +
        '        on-create="setWidgetId(widgetId)"'   +
        '        on-success="setResponse(response)"'  +
        '        on-expire="cbExpiration()"'          +
        '></div>'                                     +
        '<div>'                                       +
        ' <md-button type="submit">Submit</md-button>'+
        '</div>'                                      +
        '</form>',
      parent: angular.element(document.body),
      targetEvent: ev,
      clickOutsideToClose:false
    })
  };

  function DialogController($scope, $mdDialog) {

    console.log("this is your app's controller");
    $scope.response = null;
    $scope.widgetId = null;
    $scope.valid = false;
    $scope.model = {
        key: '6Leg5QgUAAAAAHqlmVPXVL9PP7njR6EPwUsOU16Z'
    };
    $scope.setResponse = function (response) {
        console.info('Response available');
        $scope.response = response;
    };
    $scope.setWidgetId = function (widgetId) {
        console.info('Created widget ID: %s', widgetId);
        $scope.widgetId = widgetId;
    };
    $scope.cbExpiration = function() {
        console.info('Captcha expired. Resetting response object');
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
     };
    $scope.submit = function () {

        /**
         * SERVER SIDE VALIDATION
         *
         * You need to implement your server side validation here.
         * Send the reCaptcha response to the server and use some of the server side APIs to validate it
         * See https://developers.google.com/recaptcha/docs/verify
         */

         $http.post("/reCaptchaCheck", {"g-recaptcha-response": $scope.response}).then(angular.bind(this, function (obj) {
             $scope.valid = obj.data.responseCode == 0? true: false;
             console.log('Valid', $scope.valid);
             $scope.checkServerResponse();
         }));

        //console.log('sending the captcha response to the server', $scope.response);

    };
    $scope.checkServerResponse = function(){
      if ($scope.valid) {
          console.log('Success');
          $mdDialog.hide();
      } else {
          console.log('Failed validation');
          // In case of a failed validation you need to reload the captcha
          // because each response can be checked just once
          vcRecaptchaService.reload($scope.widgetId);
      }
    }

  }

  $scope.blockViewCaptcha();

  /* Infinite Scroll */

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
