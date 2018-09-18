angular.module("emailFinder",[])
.controller("mainCtrl",function($scope, $http){
    $scope.isGoogle = true;
    $scope.isBing = true;
    $scope.searchNews = function(){
        $scope.isLoading = true;
        $scope.results = [];
            $http.get("/news?name=" + $scope.query.toLowerCase()).success(function(data){
                $scope.results = data;
                $scope.isLoading = false;
            })   
            
    }
    $scope.getDomain = function(str){
        return str.replace(/.*@/, "");
    };
})