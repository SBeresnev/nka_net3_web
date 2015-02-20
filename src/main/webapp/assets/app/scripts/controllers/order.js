/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('OrderCtrl', function ($scope, $http, $routeParams, httpServices) {
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

        $scope.operationTypes = [{
            "prelabel": "",
            "label": "Гос. регистрация",
            "children": [{
                "prelabel": "Гос. регистрация",
                "label": "изменение"
            }, {
                "prelabel": "Гос. регистрация",
                "label": "создание"
            }]
        }]

        $scope.bases = [{
            "prelabel": "",
            "label": "Выделение участка",
            "children": [{
                "prelabel": "Выделение участка",
                "label": "документ"
            }, {
                "prelabel": "Выделение участка",
                "label": "создание"
            }]
        }]


        $scope.subjecttypes = [
            {id: 100, name: 'Гражданин РБ'},
            {id: 2, name: 'Не Гражданин РБ'},
            {id: 200, name: 'ИП Резидент РБ'},
            {id: 4, name: 'ИП Не резидет РБ'},
            {id: 5, name: 'Республика Беларусь'},
            {id: 6, name: 'Иностранное государство'},
            {id: 7, name: 'Организация'}
        ];

        $scope.doctypes = [
            {id: 1, name: 'Авизо'},
            {id: 2, name: 'Акт'},
            {id: 3, name: 'Вид на жительство '},
            {id: 4, name: 'Выписка'},
            {id: 5, name: 'Государственный акт'},
            {id: 6, name: 'Доверенность'},
            {id: 7, name: 'Договор (соглашение)'},
            {id: 8, name: 'Заявление'},
            {id: 9, name: 'Землеустроительное дело'},
            {id: 10, name: 'Иной документ '},
            {id: 11, name: 'Определение'},
            {id: 12, name: 'Паспорт'},
            {id: 13, name: 'Предписание'},
            {id: 14, name: 'Приговор'}
        ];

        $scope.objecttypes = [
            {id: 1, name: 'Объект'},
            {id: 2, name: 'ПИК'},
            {id: 2, name: 'Право'},
            {id: 4, name: 'Доля'},
            {id: 5, name: 'Дело'},
            {id: 6, name: 'Право перехода'}
        ]
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
            httpServices.searchSubjects($scope.typeSearch.id, $scope.searchSubject.number, $scope.searchSubject.fioAndName, $scope);
        };

        $scope.updateSubjectForm = function (subject) {
            $scope.subjects = [];
            $scope.showSubjectsTable = false;
            if ($scope.clientActive == 'active') {
                $scope.typeClient = {id: JSON.parse(subject).subjectType.code_id};
                $scope.client = angular.copy(JSON.parse(subject));
                $scope.client.bothRegDate = new Date(angular.copy(JSON.parse(subject)).bothRegDate)
            }
            if ($scope.representativeActive == 'active') {
                $scope.typeRepresent = {id: JSON.parse(subject).subjectType.code_id};
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
            if ($scope.clientActive == 'active') {
                httpServices.updateSubject($scope.client);
                $scope.client = {};
                $scope.typeClient = null
            }
            if ($scope.representativeActive == 'active') {
                httpServices.updateSubject($scope.represent);
                $scope.represent = {};
                $scope.typeRepresent = null
            }
        }
    })
