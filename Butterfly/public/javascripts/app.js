var app = angular.module('communityBoard',[]);

app.controller('mainController', function($http) {
    this.loggedIn = false;
    this.register = false;
    this.loginFailed = false;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.checkLogin = function() {
        var request = $http({
            method: 'POST',
            url: "/validateLogin",
            data: {
                email: this.email,
                password: this.password
            }
        });
        request.success(function () {
           this.loggedIn = true;
        });
    };

    this.sendMessage  = function() {

    };

    this.createAccount = function () {
        this.register = true;
    };

    this.accountCreated = function () {
        this.register = false;
        this.loggedIn = true;
    };

    this.cancelAccountCreate = function () {
        this.register = false;
        this.loggedIn = false;
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
