var app = angular.module('communityBoard',[]);

app.controller('mainController', function($scope, $http) {
    $scope.loggedIn = false;
    this.register = false;
    $scope.loginFailed = false;
    this.firstName = "";
    this.lastName = "";
    this.googleID = "";
    this.password = "";
    $scope.result = "";
    this.checkLogin = function() {
        var request = $http({
            method: 'GET',
            url: "/validateLogin",
            params: {
                googleID: this.googleID,
                password: this.password
            }
        });
        console.log(request);
        request.success(function (results) {
            if (results === "success") {
                $scope.loggedIn = true;
                $scope.loginFailed = false;
                console.log($scope.loggedIn);
            }
            else if (results === "failed") {
                $scope.loginFailed = true;
            }
        });
    };

    this.sendMessage  = function() {

    };

    this.createAccount = function () {
        this.register = true;
    };

    this.accountCreated = function () {
        this.register = false;
        $scope.loggedIn = true;
    };

    this.cancelAccountCreate = function () {
        this.register = false;
        $scope.loggedIn = false;
    };

});

app.controller('myController', function($scope, $http) {
    $scope.data = [];
    var request = $http.get('/data');
    request.success(function(data) {
        $scope.data = data;
    });
    request.error(function(data){
        console.log('Error: ' + data);
    });
});
app.controller('imagesController', function($scope) {
    $scope.image = '../images/logo.png';
});
