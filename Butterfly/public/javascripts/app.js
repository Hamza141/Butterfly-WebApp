var app = angular.module('communityBoard',[]);

app.controller('mainController', function($scope, $http) {
    $scope.loggedIn = false;
    $scope.registerMain = false;
    $scope.registerFailed = false;
    $scope.loginFailed = false;
    $scope.creatingCommunity = false;
    $scope.createCommunityFailed = false;
    $scope.communityList = [];
    this.communityName = "";
    this.communityCategory = "";
    this.communitySubCategory = "";
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
        //console.log(request);
        request.success(function (results) {
            if (results === "success") {
                $scope.loggedIn = true;
                $scope.loginFailed = false;
                //console.log($scope.loggedIn);
            }
            else if (results === "failed") {
                $scope.loginFailed = true;
            }
        });
    };

    this.createAccount = function () {
        $scope.registerMain = true;
    };

    this.accountCreated = function () {
        var request = $http({
            method: 'GET',
            url: "/registerUser",
            params: {
                googleID: this.googleID,
                password: this.password,
                firstName: this.firstName,
                lastName: this.lastName
            }
        });
        request.success(function (results) {
            //console.log(results);
            if (results === "success") {
                $scope.loggedIn = true;
                $scope.registerFailed = false;
                $scope.registerMain = false;
            }
            else if (results === "failure") {
                $scope.registerMain = true;
                $scope.loggedIn = false;
                $scope.registerFailed = true;
            }
        })
    };

    this.cancelAccountCreate = function () {
        $scope.registerMain = false;
        $scope.registerFailed = false;
        $scope.loggedIn = false;
    };

    this.createCommunity = function () {
        $scope.creatingCommunity = true;
    };

    this.validateCommunity = function () {
        var request = $http({
            method: 'GET',
            url: "/validateCommunity",
            params: {
                communityName: this.communityName,
                category: this.communityCategory,
                subcategory: this.communitySubCategory
            }
        });
        request.success(function (results) {
            $scope.creatingCommunity = false;
            $scope.communityList.push(results);
        })
    };

    this.cancelCreateCommunity = function () {
        $scope.creatingCommunity = false;
    }
    var request = $http({
        method: 'GET',
        url: '/listCommunities'
    });
    request.success(function(communities) {
        console.log(communities);
        $scope.communityList = communities;
    });
    request.error(function(data){
        console.log('Error: ' + data);
    });
});

app.controller('imagesController', function($scope) {
    $scope.image = '../images/logo.png';
});
