/**
 * Created by belonovich on 25.02.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('SubjectCtrl', function ($scope, $http, $location, httpServices, DOMAIN) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.var = {
            loading: false,
            states: '',
            items: '',
            subjecttypes: '',
            ates: [{label: 'loading'}]
        };

        $scope.init = function () {
            $scope.var.loading = true;
            $http.get(DOMAIN + "/nka_net3/catalog/states")
                .then(function (res) {
                    $scope.var.states = res.data;
                    $scope.var.subj = {sitizens: $scope.var.states[81]};
                    $scope.var.loading = false;
                });

            $http.get("/data/doctype.json")
                .then(function (res) {
                    $scope.var.items = res.data;
                    $scope.var.loading = false;
                });

            $http.get("/data/ate.json")
                .then(function (res) {
                    $scope.var.ates = res.data;
                    $scope.var.loading = false;
                });

            $http.get(DOMAIN + "/nka_net3/catalog/subjectTypes")
                .then(function (res) {
                    $scope.var.subjecttypes = res.data;
                    $scope.var.loading = false;
                });
        };

        $scope.searchSubjects = function () {
            $scope.var.loading = true;
            $scope.var.subj = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchSubjects($scope.var.typeSearch.code_id, $scope.var.searchSubject.number, $scope.var.searchSubject.fioAndName, $scope);
        };

        $scope.updateSubjectForm = function (subject) {
            $scope.var.subj = [];
            $scope.var.showSubjectsTable = false;
            $scope.var.subjtype = JSON.parse(subject).subjectType;
            $scope.var.subj = angular.copy(JSON.parse(subject));
            $scope.var.subj.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate)
        };

        $scope.searchPass = function () {

            if ($scope.validId() && $scope.validPass()) {
                $scope.var.loading = true;
                $scope.var.subjects = [];
                delete $http.defaults.headers.common['X-Requested-With'];
                httpServices.searchPass($scope.var.searchSubject.passSeriesAndNumber, $scope.var.searchSubject.idNumber, $scope);
            } else {
                alert("Ошибочно заполненны поля!");
            }
        };

        $scope.pushSubject = function (subject) {
            var url = DOMAIN+'/nka_net3/subject/add';
            subject.subjectType = angular.copy($scope.var.subjtype);
            $http.post(url, subject);
            $scope.var.subj = {};
        };

        $scope.updateSubject = function (subject) {
            var url = DOMAIN+'/nka_net3/subject/update';
            subject.subjectType = angular.copy($scope.var.subjtype);
            $http.put(url, subject);
            $scope.var.subj = {};
        };

        $scope.validPass = function () {
            var exp = /^[A-Z,a-z]{2}(\d){7}$/;
            return exp.test($scope.var.searchSubject.passSeriesAndNumber);
        };

        $scope.validId = function () {
            var exp = /^(\d){7}[A-Z,a-z](\d){3}[A-Z,a-z]{2}(\d)$/;
            return exp.test($scope.var.searchSubject.idNumber);
        };
    });
