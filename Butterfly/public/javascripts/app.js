var app = angular.module('communityBoard',[]);

app.controller('mainController', function() {
    this.loggedIn = false;
    this.checkLogin = function() {
        this.loggedIn = true;
        console.log("login\n");
    }
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
