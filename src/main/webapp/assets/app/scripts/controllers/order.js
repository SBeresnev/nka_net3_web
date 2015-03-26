/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('OrderCtrl', function ($scope, $http, $routeParams, httpServices, ordervar, DOMAIN) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.var = {};
        $scope.var.searchSubject = {number: ' ', fioAndName: ' ' };
        $scope.var = angular.copy(ordervar);
        $scope.var.id = $routeParams.id;

        $scope.init = function () {
            $scope.getDecl();

            $http.get(DOMAIN+"/nka_net3/dict/states")
                .then(function (res) {
                    $scope.var.states = res.data;
                    $scope.var.client = {sitizens :$scope.var.states[81]};
                    $scope.var.represent = {sitizens :$scope.var.states[81]};
                });

            $http.get("/data/doctype.json")
                .then(function (res) {
                    $scope.var.items = res.data;
                });

            $http.get("/data/ate.json")
                .then(function (res) {
                    $scope.var.ates = res.data;

                });

            $http.get(DOMAIN+"/nka_net3/dict/subjectTypes")
                .then(function (res) {
                    $scope.var.subjecttypes = res.data;
                });

        };

        $scope.searchSubjects = function () {
            $scope.var.showSubjectsTable = true;
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchSubjects($scope.var.typeSearch.code_id, $scope.var.searchSubject.number, $scope.var.searchSubject.fioAndName, $scope);
        };

        $scope.searchPass = function () {
            if($scope.validId()&& $scope.validPass()){
                $scope.var.showSubjectsTable = true;
                $scope.var.subjects = [];
                delete $http.defaults.headers.common['X-Requested-With'];
                httpServices.searchPass( $scope.var.searchSubject.passSeriesAndNumber, $scope.var.searchSubject.idNumber, $scope);
            } else{
                alert("Ошибочно заполненны поля!");
            }
        };

        $scope.updateSubjectForm = function (subject) {
            $scope.var.subjects = [];
            $scope.var.showSubjectsTable = false;
            if ($scope.var.clientActive == 'active') {
                $scope.var.typeClient = {code_id: JSON.parse(subject).subjectType.code_id};
                $scope.var.client = angular.copy(JSON.parse(subject));
                $scope.var.client.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate);
            }
            if ($scope.var.representativeActive == 'active') {
                $scope.var.typeRepresent = {code_id: JSON.parse(subject).subjectType.code_id};
                $scope.var.represent = angular.copy(JSON.parse(subject));
                $scope.var.represent.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate);
            }
        };

        $scope.representativeActivate = function () {
            $scope.var.representativeActive = "active";
            $scope.var.clientActive = "";
        };

        $scope.clientActivate = function () {
            $scope.var.representativeActive = "";
            $scope.var.clientActive = "active";
        };

        $scope.say = function (str) {
            $scope.var.doctype = str;
        };

        $scope.open = function () {
            if ($scope.var.openVar == 'open') {
                $scope.var.openVar = '';
            } else {
                $scope.var.openVar = 'open';
            }
        };

        $scope.updateSubject = function () {
            if ($scope.var.clientActive == 'active') {
                httpServices.updateSubject($scope.var.client);
                $scope.var.client = {};
                $scope.var.typeClient = null
            }
            if ($scope.var.representativeActive == 'active') {
                httpServices.updateSubject($scope.represent);
                $scope.var.represent = {};
                $scope.var.typeRepresent = null;
            }
        };

        $scope.pushSubject = function(){
            var subject = { type:"" };
            if($scope.var.clientActive == 'active'){
                subject = angular.copy($scope.var.client);
                subject.type = "заказчик";
                subject.name = ($scope.var.client.firstname != undefined ? $scope.var.client.firstname : "") + " " +  ($scope.var.client.surname != undefined ? $scope.var.client.surname : "") + " " +  ($scope.var.client.shortname != undefined ? $scope.var.client.shortname : "");
                $scope.var.client = {};
            } else {
                subject = angular.copy($scope.var.represent);
                subject.type = "представитель";
                subject.name =  ($scope.var.represent.firstname != undefined ? $scope.var.represent.firstname : "") + " " +  ($scope.var.represent.surname != undefined ? $scope.var.represent.surname : "") + " " +  ($scope.var.represent.shortname != undefined ? $scope.var.represent.shortname : "");
                $scope.var.represent = {};
            }
            $scope.var.selectedSubjects.push(subject);
        };

        $scope.modalSubject = function (s) {
            $scope.var.modalSubjects = angular.copy(s);
            $scope.showSubject = !$scope.showSubject;
        };

        $scope.isObject = function(a){
            if(a == null){
                return false;
            } else{
                if(a instanceof Date){
                    return false;
                }else{
                    return typeof a == 'object';
                }
            }
        };

        $scope.validPass =  function(){
            var exp = /^[A-Z,a-z]{2}(\d){7}$/;
            return exp.test($scope.var.searchSubject.passSeriesAndNumber);
        };

        $scope.validId = function(){
            var exp = /^(\d){7}[A-Z,a-z](\d){3}[A-Z,a-z]{2}(\d)$/;
            return exp.test($scope.var.searchSubject.idNumber);
        };

        $scope.getDecl = function(){
            $scope.showLoading = true;
            $http.get(DOMAIN+"/nka_net3/decl/get_decl",{
                params:{id: $routeParams.id}
            })
                .then(function (res) {
                    $scope.var.decl = res.data;
                    $scope.showLoading = false;
                });
        };

        $scope.deleteSubject = function(declarantId){
            if(confirm("Вы уверены что хотите удалить субъекта?")){
                $http.delete(DOMAIN+"/nka_net3/decl/delete_subject_in_decl",{
                    params:{idDecl: $routeParams.id, declarantId: declarantId}
                })
                    .then(function (res) {
                        $scope.getDecl();
                    });
            }
        };

        $scope.setStatus = function(status){
            $scope.showLoading = true;
            $http.post(DOMAIN+"/nka_net3/decl/status",{
                status: status,
                declId: $routeParams.id
            })
                .then(function (res) {
                    $scope.var.decl = res.data;
                    $scope.showLoading = false;
                });
        };

        $scope.addSubject = function(subjectId){
            $http.get(DOMAIN+"/nka_net3/decl/add_subject_in_decl",{
                params:{
                    idDecl: $routeParams.id,
                    idSubject: subjectId,
                    type: $scope.var.representativeActive ? 2 : 1
                }
            })
                .then(function (res) {
                    $scope.getDecl();
                });
        }

        $scope.getLast = function(item){
            if(item != undefined){
                var compareItem = item[0];
                if(item.length > 1){
                    for(var i = 1; i < item.length; i++){
                        compareItem = item[i].resolutionDate > compareItem.resolutionDate ? item[i] : compareItem;
                    }
                }
                return compareItem;
            }
        }
    });
