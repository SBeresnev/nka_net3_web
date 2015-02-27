/**
 * Created by belonovich on 25.02.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('SubjectCtrl', function ($scope,$http, $location, httpServices) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.var = {
            states:'',
            items : '',
            ates : '',
            subjecttypes : ''
        };
        $scope.init = function () {
            $http.get("http://localhost:8080/nka_net3/dict/states")
                .then(function (res) {
                    $scope.var.states = res.data;
                });
            $http.get("/data/doctype.json")
                .then(function (res) {
                    $scope.var.items = res.data;
                });
            $http.get("/data/ate.json")
                .then(function (res) {
                    $scope.var.ates = res.data;
                });
            $http.get("http://localhost:8080/nka_net3/dict/subjectTypes")
                .then(function (res) {
                    $scope.var.subjecttypes = res.data;
                });
        };

        $scope.searchSubjects = function () {
            $scope.var.showSubjectsTable = true;
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            try{
                $scope.var.searchSubject.number;
            }catch (e){
                $scope.var.searchSubject['number'] = "";
            }
            try{
                $scope.var.searchSubject.fioAndName;
            }catch (e){
                $scope.var.searchSubject['fioAndName'] = "";
            }
            httpServices.searchSubjects($scope.var.typeSearch.code_id, $scope.var.searchSubject.number, $scope.var.searchSubject.fioAndName, $scope);
        };

        $scope.updateSubjectForm = function (subject) {
            $scope.var.subjects = [];
            $scope.var.showSubjectsTable = false;
            $scope.var.typeRepresent = {code_id: JSON.parse(subject).subjectType.code_id};
            $scope.var.represent = angular.copy(JSON.parse(subject));
            $scope.var.represent.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate)
        };

    });
