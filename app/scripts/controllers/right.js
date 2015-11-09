/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $location, $filter, DOMAIN) {

    $scope.scrollTo = function (hash) {
        $location.hash(hash);
    };


});


