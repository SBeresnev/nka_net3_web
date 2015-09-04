/**
 * Created by belonovich on 28.04.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('TestCtrl', function ($scope,$http, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.showData = function( ){
            $scope.friends = [
                {name:'John', age:25, gender:'boy'},
                {name:'Jessie', age:30, gender:'girl'},
                {name:'Johanna', age:28, gender:'girl'},
                {name:'Joy', age:15, gender:'girl'},
                {name:'Mary', age:28, gender:'girl'},
                {name:'Peter', age:95, gender:'boy'},
                {name:'Sebastian', age:50, gender:'boy'},
                {name:'Erika', age:27, gender:'girl'},
                {name:'Patrick', age:40, gender:'boy'},
                {name:'Samantha', age:60, gender:'girl'}
            ]
            $scope.curPage = 0;
            $scope.pageSize = 3;
            $scope.numberOfPages = function() {
                return Math.ceil($scope.friends.length / $scope.pageSize);
            };

        }

    });
