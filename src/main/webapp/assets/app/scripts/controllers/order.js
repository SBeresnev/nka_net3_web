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

    $scope.subjecttypes = [
      {id: 1, name: 'Гражданин РБ'},
      {id: 2, name: 'Не Гражданин РБ'},
      {id: 3, name: 'ИП Резидент РБ'},
      {id: 4, name: 'ИП Не резидет РБ'},
      {id: 5, name: 'Республика Беларусь'},
      {id: 6, name: 'Иностранное государство'},
      {id: 7, name: 'Организация'}
    ];

    $scope.showPanel1 = false
    $scope.showPanel2 = false
    $scope.showPanel3 = false
    $scope.showSubjectsTable = false
    $scope.representativeActive = "";
    $scope.clientActive = "active";
    $scope.items = null;
    $scope.ates = [{label:'loading'}];
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
    }



    $scope.searchSubjects = function () {
      $scope.showSubjectsTable = true;
      $http.get('/data/subjects.json').then(function (res) {
        $scope.subjects = res.data;
      });
    }

    $scope.updateSubjectForm = function (name, number, addr, type) {
      alert(name);
    }

    $scope.representative = function () {
      $scope.representativeActive = "active";
      $scope.clientActive = "";
    }

    $scope.client = function () {
      $scope.representativeActive = "";
      $scope.clientActive = "active";
    }

    $scope.say = function (str) {
      $scope.doctype = str;
    }


    $scope.open = function(){
      if($scope.openVar == 'open') {
        $scope.openVar = '';
      } else{
        $scope.openVar = 'open';
      }
    }

    $scope.my_tree_handler = function(branch){
      alert(JSON.stringify(branch))
    }

    $scope.options = {
      language: "ru",
      autoclose: true,
      startView: 2
    }
    $scope.showModal = false;
    $scope.modal = function(){
      $scope.showModal = !$scope.showModal;
    };

  })



