/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';

angular.module('assetsApp')
  .controller('OrderCtrl', function ($scope, $http, $routeParams) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.typeSearch = {id: ''};
    $scope.searchSubject = {number: '', fioAndName: ''};
    $scope.options = {
      language: "ru",
      autoclose: true,
      startView: 2
    }
    $scope.subjecttypes = [
      {id: 100, name: 'Гражданин РБ'},
      {id: 2, name: 'Не Гражданин РБ'},
      {id: 3, name: 'ИП Резидент РБ'},
      {id: 4, name: 'ИП Не резидет РБ'},
      {id: 5, name: 'Республика Беларусь'},
      {id: 6, name: 'Иностранное государство'},
      {id: 7, name: 'Организация'}
    ];
    $scope.items = null;
    $scope.typeClient = null;
    $scope.showModal = false;
    $scope.showPanel1 = false;
    $scope.showPanel2 = false;
    $scope.showPanel3 = false;
    $scope.showSubjectsTable = false;
    $scope.representativeActive = "";
    $scope.clientActive = "active";
    $scope.ates = [{label: 'loading'}];
    $scope.openVar = '';

    $scope.id = $routeParams.id;
    $scope.order = "";

    $scope.init = function () {

      $http.get("/data/orders/" + $scope.id + '.json')
        .then(function (res) {
          $scope.order = res.data;
        });

      $http.get("/data/doctype.json")
        .then(function (res) {
          $scope.items = res.data;
        });

      $http.get("/data/ate.json")
        .then(function (res) {
          $scope.ates = res.data;
        });
    };


    $scope.searchSubjects = function () {
      $scope.showSubjectsTable = true;
      $scope.subjects = [];
      delete $http.defaults.headers.common['X-Requested-With'];
      $http({
        url: 'http://localhost:8080/nka_net3/subject/private',
        type: "GET",
        responseType: "jsonp",
        params: {
          "type": $scope.typeSearch.id,
          "number": $scope.searchSubject.number,
          "name": $scope.searchSubject.fioAndName
        }
      }).then(function (res) {
        $scope.subjects = res.data;
      })
    };

    $scope.updateSubjectForm = function (subject) {
      $scope.subjects = [];
      $scope.showSubjectsTable = false;
      if ($scope.clientActive == 'active') {
        $scope.typeClient = {id: JSON.parse(subject).subjectType};
        $scope.client = angular.copy(JSON.parse(subject));
        $scope.client.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate)
      }
      if ($scope.representativeActive == 'active') {
        $scope.typeRepresent = {id: JSON.parse(subject).subjectType};
        $scope.represent = angular.copy(JSON.parse(subject));
        $scope.represent.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate)
      }

    };

    $scope.representativeActivate = function () {
      $scope.representativeActive = "active";
      $scope.clientActive = "";
    };

    $scope.clientActivate = function () {
      $scope.representativeActive = "";
      $scope.clientActive = "active";
    };

    $scope.say = function (str) {
      $scope.doctype = str;
    };


    $scope.open = function () {
      if ($scope.openVar == 'open') {
        $scope.openVar = '';
      } else {
        $scope.openVar = 'open';
      }
    };

    $scope.my_tree_handler = function (branch) {
      alert(JSON.stringify(branch))
    };

    $scope.modal = function () {
      $scope.showModal = !$scope.showModal;
    };

    $scope.updateSubject = function () {

        var url='http://localhost:8080/nka_net3/subject/update';
        var params = "?";
      for(var index in $scope.client){
       if(index != "bothRegDate"  && index != "datestart" ){params+=""+index+"="+$scope.client[index]+"&";}
      }
        var method="PUT";
        var http = new XMLHttpRequest();
        http.open(method,url+params,true);
        http.send();
    }
  })
