'use strict';

/**
 * @ngdoc overview
 * @name assetsApp
 * @description
 * # assetsApp
 *
 * Main module of the application.
 */
var app = angular
    .module('assetsApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'angularBootstrapNavTree'
    ])
    .constant('DOMAIN', "" + window.location.protocol + '//'+ window.location.hostname+":8080")
    .config(["$routeProvider", "$httpProvider", function ($routeProvider, $httpProvider) {
        $httpProvider.defaults.useXDomain = true;

        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl'
            })
            .when('/orders', {
                templateUrl: 'views/orders.html',
                controller: 'OrdersCtrl'
            })
            .when('/order/:id', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .when('/order', {
                templateUrl: 'views/order.html',
                controller: 'OrderCtrl'
            })
            .when('/object', {
                templateUrl: 'views/object.html',
                controller: 'ObjectCtrl'
            })
            .when('/doc', {
                templateUrl: 'views/doc.html',
                controller: 'DocCtrl'
            })
            .when('/subject', {
                templateUrl: 'views/subject.html',
                controller: 'SubjectCtrl'
            })
            .when('/items', {
                templateUrl: 'views/items.html',
                controller: 'ItemsCtrl'
            })
            .when('/dict', {
                templateUrl: 'views/catalogs.html',
                controller: 'CatalogCtrl'
            })
            .when('/dependency', {
                templateUrl: 'views/dependency.html',
                controller: 'DependencyCtrl'
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'TestCtrl'
            })
            .otherwise({
                redirectTo: '#/'
            });
    }])
    .run(["$timeout", "$location", "$rootScope", function ($timeout, $location, $rootScope) {
        $rootScope.text = {
            general: "ГЛАВНАЯ",
            settings: "НАСТРОЙКИ",
            exit: "ВЫХОД",
            technicalSupport: "Тех поддержка"
        }

    }])
    .directive('modal', function () {
        return {
            template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="modal()">&times;</button>' +
            '<h4 class="modal-title">{{ title }}</h4>' +
            '</div>' +
            '<div class="modal-body" ng-transclude>' +
            '</div></div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    })
    .filter('filterSubjectType', function () {
        return function (items) {
            var filtered = [];
            if (items != undefined) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.code_id < 500 && (item.code_id == 100 || item.code_id == 200 || item.code_id >= 300 )) {
                        filtered.push(item);
                    }
                }
            }
            return filtered;
        };
    })
    .filter('filterSubjectTypeForCreate', function () {
        return function (items) {
            var filtered = [];
            if (items != undefined) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.code_id < 200 && item.code_id != 100) {
                        filtered.push(item);
                    }
                }
            }
            return filtered;
        };
    }).directive('clickAnywhereButHere', ["$document", function($document){
        return {
            restrict: 'A',
            link: function(scope, elem, attr, ctrl) {
                elem.bind('click', function(e) {
                    // this part keeps it from firing the click on the document.
                    e.stopPropagation();
                });
                $document.bind('click', function() {
                    // magic here.
                    scope.$apply(attr.clickAnywhereButHere);
                })
            }
        }
    }]);
angular.module('assetsApp').value('ordervar',
    {
        typeSearch: { id: ''},
        searchSubject: { number: '', fioAndName: ''},
        operationTypes: [{
            "prelabel": "",
            "label": "Гос. регистрация",
            "children": [{
                "prelabel": "Гос. регистрация",
                "label": "изменение"
            },{
                "prelabel": "Гос. регистрация",
                "label": "создание"
            }]
        }],
        selectedSubjects: [],
        bases: [{
            "prelabel": "",
            "label": "Выделение участка",
            "children": [{
                "prelabel": "Выделение участка",
                "label": "документ"
            },{
                "prelabel": "Выделение участка",
                "label": "создание"
            }]
        }],
        doctypes :[
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
        ],
        objecttypes:[
            {id: 1, name: 'Объект'},
            {id: 2, name: 'ПИК'},
            {id: 2, name: 'Право'},
            {id: 4, name: 'Доля'},
            {id: 5, name: 'Дело'},
            {id: 6, name: 'Право перехода'}
        ],
        items: null,
        typeClient: null,
        showModal: false,
        showPanel1P: false,
        showPanel2: false,
        showPanel3: false,
        showSubjectsTable: false,
        representativeActive: "",
        clientActive: "active",
        ates: [{label: 'loading'}],
        openVar: '',
        states: [],
        order: "",
        decl: {},
        operationBase : null,
        operationSubType : null,
        operationType: null,
    }

);

'use strict';

/**
 * @ngdoc function
 * @name assetsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the assetsApp
 */
angular.module('assetsApp')
  .controller('MainCtrl', ["$scope", function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  }]);

/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';


angular.module('assetsApp')
    .controller('OrdersCtrl', ["$scope", "$http", "$location", "DOMAIN", "ordervar", function ($scope, $http, $location, DOMAIN, ordervar) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.showId = [];
        $scope.init = function () {
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/decl/get_journal")
                .then(function (res) {
                    $scope.orders = res.data;
                    $scope.showLoading = false;
                }).catch(function () {
                    $scope.showLoading = false;
                    alert("Ошибка сервера");
                });
        };

        $scope.getOrderById = function (id) {
            $location.path("/order/" + id);
        };

        $scope.newOrder = function () {
            $http.get(DOMAIN + "/nka_net3/decl/new_decl")
                .then(function (res) {
                    $location.path("/order/" + res.data.decl_id);
                }).catch(function () {
                    $scope.showLoading = false;
                    alert("Ошибка сервера");
                });
        };

        $scope.filterIdenticalSubject = function (element, index, array) {
            var result = true;
            if (element.declrepr_type == 2) {
                result = $scope.showId.indexOf(element.person.subjectId) == -1;
                $scope.showId.push(element.person.subjectId);
            }
            if (index + 1 == array.length) {
                $scope.showId = [];
            }
            return result;
        };

        $scope.getLast = function (item) {
            var compareItem = item[0];
            if (item.length > 1) {
                for (var i = 1; i < item.length; i++) {
                    compareItem = item[i].resolutionDate > compareItem.resolutionDate ? item[i] : compareItem;
                }
            }
            return compareItem;
        }
    }]);

/**
 * Created by belonovich on 21.01.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('OrderCtrl', ["$scope", "$http", "$routeParams", "httpServices", "ordervar", "DOMAIN", function ($scope, $http, $routeParams, httpServices, ordervar, DOMAIN) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.var = {};
        $scope.var.searchSubject = {number: ' ', fioAndName: ' '};
        $scope.var = angular.copy(ordervar);
        $scope.var.id = $routeParams.id;
        $scope.selectedClient = [];
        $scope.showId = [];

        $scope.init = function () {
            $scope.getDecl();

            $http.get(DOMAIN + "/nka_net3/catalog/states")
                .then(function (res) {
                    $scope.var.states = res.data;
                    $scope.var.client = {sitizens: $scope.var.states[81]};
                    $scope.var.represent = {sitizens: $scope.var.states[81]};
                });

            $http.get(DOMAIN + "/nka_net3/catalog/subjectTypes")
                .then(function (res) {
                    $scope.var.subjecttypes = res.data;
                });

            $http.get(DOMAIN + "/nka_net3/catalog/operationType")
                .then(function (res) {
                    $scope.var.operationType = res.data;
                });

            $http.get(DOMAIN + "/nka_net3/catalog/operationSubType")
                .then(function (res) {
                    $scope.var.operationSubType = res.data;
                });

            $http.get(DOMAIN + "/nka_net3/catalog/operationBase")
                .then(function (res) {
                    $scope.var.operationBase = res.data;
                });
            /*.get(DOMAIN+"/nka_net3/operations/get_from_decl",{ params: { declId: $scope.var.id }})
             .then(function (res) {
             $scope.var.decl.operations = res.data;
             });*/
        };

        $scope.searchSubjects = function () {
            if ($scope.var.typeSearch.code_id != undefined) {
                $scope.var.showSubjectsTable = true;
                $scope.var.subjects = [];
                delete $http.defaults.headers.common['X-Requested-With'];
                httpServices.searchSubjects($scope.var.typeSearch.code_id, $scope.var.searchSubject.number, $scope.var.searchSubject.fioAndName, $scope);
            } else {
                alert("Не выбран тип субъекта!");
            }
        };

        $scope.searchPass = function () {
            if ($scope.validId() && $scope.validPass()) {
                $scope.var.showSubjectsTable = true;
                $scope.var.subjects = [];
                delete $http.defaults.headers.common['X-Requested-With'];
                httpServices.searchPass($scope.var.searchSubject.passSeriesAndNumber, $scope.var.searchSubject.idNumber, $scope);
            } else {
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

        $scope.pushSubject = function () {
            var subject = {type: ""};
            if ($scope.var.clientActive == 'active') {
                subject = angular.copy($scope.var.client);
                subject.type = "заказчик";
                subject.name = ($scope.var.client.firstname != undefined ? $scope.var.client.firstname : "") + " " + ($scope.var.client.surname != undefined ? $scope.var.client.surname : "") + " " + ($scope.var.client.shortname != undefined ? $scope.var.client.shortname : "");
                $scope.var.client = {};
            } else {
                subject = angular.copy($scope.var.represent);
                subject.type = "представитель";
                subject.name = ($scope.var.represent.firstname != undefined ? $scope.var.represent.firstname : "") + " " + ($scope.var.represent.surname != undefined ? $scope.var.represent.surname : "") + " " + ($scope.var.represent.shortname != undefined ? $scope.var.represent.shortname : "");
                $scope.var.represent = {};
            }
            $scope.var.selectedSubjects.push(subject);
        };

        $scope.modalSubject = function (s) {
            $scope.var.modalSubjects = angular.copy(s);
            $scope.showSubject = !$scope.showSubject;
        };

        $scope.isObject = function (a) {
            if (a == null) {
                return false;
            } else {
                if (a instanceof Date) {
                    return false;
                } else {
                    return typeof a == 'object';
                }
            }
        };

        $scope.validPass = function () {
            var exp = /^[A-Z,a-z]{2}(\d){7}$/;
            return exp.test($scope.var.searchSubject.passSeriesAndNumber);
        };

        $scope.validId = function () {
            var exp = /^(\d){7}[A-Z,a-z](\d){3}[A-Z,a-z]{2}(\d)$/;
            return exp.test($scope.var.searchSubject.idNumber);
        };

        $scope.getDecl = function () {
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/decl/get_decl", {
                params: {id: $routeParams.id}
            }).then(function (res) {
                $scope.var.decl = res.data;
                $scope.showLoading = false;
            });
        };

        $scope.deleteSubject = function (declarant) {
            if (confirm("Вы уверены что хотите удалить субъекта?")) {
                var ids = $scope.searchDependSubjectIds(declarant);
                $scope.selectedClient.splice($scope.selectedClient.indexOf(declarant.declarantId), 1);
                $http.delete(DOMAIN + "/nka_net3/decl/delete_subject_in_decl", {
                    params: {idDecl: $routeParams.id, declarantIds: ids}
                }).then(function (res) {
                    $scope.getDecl();
                });
            }
        };

        $scope.setStatus = function (status) {
            $scope.showLoading = true;
            $http.post(DOMAIN + "/nka_net3/decl/status", {
                status: status,
                declId: $routeParams.id
            })
                .then(function (res) {
                    $scope.var.decl = res.data;
                    $scope.showLoading = false;
                });
        };

        $scope.addSubject = function (subjectId) {
            $http.post(DOMAIN + "/nka_net3/decl/add_subject_in_decl", {
                idDecl: $routeParams.id,
                idSubject: subjectId,
                type: $scope.var.representativeActive ? 2 : 1,
                clients: $scope.selectedClient
            }).then(function (res) {
                $scope.getDecl();
            });
            $scope.selectedClient = [];
            $scope.var.represent = {};
            $scope.var.typeRepresent = {};
        };

        $scope.getLast = function (item) {
            if (item != undefined) {
                var compareItem = item[0];
                if (item.length > 1) {
                    for (var i = 1; i < item.length; i++) {
                        compareItem = item[i].resolutionDate > compareItem.resolutionDate ? item[i] : compareItem;
                    }
                }
                return compareItem;
            }
        };

        $scope.changeDecltype = function () {
            $scope.showLoading = true;
            $http.put(DOMAIN + "/nka_net3/decl/change_decltype", $routeParams.id)
                .then(function (res) {
                    $scope.getDecl();
                    $scope.showLoading = false;
                }).catch(function () {
                    $scope.showLoading = false;
                    alert("Ошибка сервера");
                });
        };

        $scope.addOperation = function () {
            $scope.showLoading = true;
            $http.post(DOMAIN + "/nka_net3/operations/add", {
                declId: $routeParams.id,
                operType: $scope.operationType,
                operSubtype: $scope.operationSubType,
                reason: $scope.operationBase
            }).then(function (res) {
                $scope.operationType = {};
                $scope.operationSubType = {};
                $scope.operationBase = {};
                $scope.getDecl();
                $scope.showLoading = false;
            }).catch(function () {
                $scope.showLoading = false;
                alert("Ошибка сервера");
            });
        };

        $scope.deleteOperation = function (ooperId) {
            if (confirm("Вы уверены что хотите удалить операцию?")) {
                $scope.showLoading = true;
                $http.delete(DOMAIN + "/nka_net3/operations/delete", {
                    params: {idDecl: $routeParams.id, ooperId: ooperId}
                }).then(function (res) {
                    $scope.showLoading = false;
                    $scope.getDecl();
                }).catch(function () {
                    $scope.showLoading = false;
                    alert("Ошибка сервера");
                });
            }
        };

        $scope.checkChosen = function (clientId) {
            var chosen = false;
            for (var i = 0; i < $scope.selectedClient.length; i++) {
                if ($scope.selectedClient[i] == clientId) {
                    chosen = true;
                }
            }
            return chosen;
        };

        $scope.selectClient = function (clientId) {
            if ($scope.checkChosen(clientId) == false) {
                $scope.selectedClient.push(clientId);
            } else {
                $scope.selectedClient.splice($scope.selectedClient.indexOf(clientId), 1);
            }
        };

        $scope.filterSubject = function (element) {
            return element.declrepr_type == 1 ? true : false;
        };

        $scope.filterIdenticalSubject = function (element, index, array) {
            var result = true;
            if (element.declrepr_type == 2) {
                result = $scope.showId.indexOf(element.person.subjectId) == -1;
                $scope.showId.push(element.person.subjectId);
            }
            if (index + 1 == array.length) {
                $scope.showId = [];
            }
            return result;
        };

        $scope.searchDependSubjectIds = function (declarant) {
            var array = [];
            if (declarant.declrepr_type == 1) {
                array.push(declarant.declarantId);
            }
            for (var i = 0; i < $scope.var.decl.declarants.length; i++) {
                if ($scope.var.decl.declarants[i].declrepr_type == 2 && ( $scope.var.decl.declarants[i].person.subjectId == declarant.person.subjectId || $scope.var.decl.declarants[i].parentPerson.person.subjectId == declarant.person.subjectId)) {
                    array.push($scope.var.decl.declarants[i].declarantId);
                }
            }
            return array;
        };

        $scope.getRelatedSubject = function (subject) {
            var array = [];
            for (var i = 0; i < $scope.var.decl.declarants.length; i++) {
                if ($scope.var.decl.declarants[i].person.subjectId == subject.person.subjectId && $scope.var.decl.declarants[i].declrepr_type == 2) {
                    array.push($scope.var.decl.declarants[i]);
                }
            }
            return array;
        };

    }]);

/**
 * Created by belonovich on 17.02.2015.
 */
angular.module('assetsApp')
    .controller('ObjectCtrl', ["$scope", function ($scope) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        $scope.var = {
            objecttypes: [
                {id: 1, name: 'Объект'},
                {id: 2, name: 'Право'},
                {id: 3, name: 'Сделка'},
                {id: 4, name: 'ПИК'},
                {id: 5, name: 'Доля права'},
                {id: 6, name: ' Переход права'}
            ],

            typeFormations: [
                {id: 1, name: 'Строение'},
                {id: 2, name: 'Участок'},
                {id: 3, name: 'Часть строения'}
            ],

            typeRights:[
                {id: 1, name: 'Собственность'},
                {id: 2, name: 'Пожизненное наследуемое владение'},
                {id: 3, name: 'Постоянное пользование'},
                {id: 4, name: 'Временное пользование'},
                {id: 5, name: 'Хозяйственное ведение'},
                {id: 6, name: 'Оперативное управление'},
                {id: 7, name: 'Сервитут'},
                {id: 8, name: 'Доверительное управление'},
                {id: 9, name: 'Рента'},
                {id: 10, name: 'Залог'},
                {id: 11, name: 'Аренда'},
                {id: 12, name: 'Безвозмездное пользование'},
                {id: 13, name: 'Ограничения (обременения) прав в использовании земель'},
                {id: 14, name: 'Ограничения (обременения) прав, установленные законодательством'},
                {id: 15, name: 'Ограничения (обременения) прав, установленные уполномоченными органами'}
            ],

            typeBargains:[
                {id: 1, name: 'Адресная продажа'},
                {id: 2, name: 'Аукцион'}
            ],

            message: {
                title : '',
                html: ''
            }
        };

        $scope.showModalDoc = false;
        $scope.showModalObject = false;

        $scope.modalDoc = function () {
            $scope.showModalDoc = !$scope.showModalDoc;
        };

        $scope.modalObject = function () {
            $scope.showModalObject = !$scope.showModalObject;
        };
    }]);

/**
 * Created by belonovich on 25.02.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('SubjectCtrl', ["$scope", "$http", "$location", "httpServices", "DOMAIN", function ($scope, $http, $location, httpServices, DOMAIN) {
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

            $http.get(DOMAIN + "/nka_net3/catalog/subjectTypes")
                .then(function (res) {
                    $scope.var.subjecttypes = res.data;
                    $scope.var.loading = false;
                });
        };

        $scope.searchSubjects = function () {
            if ($scope.var.typeSearch != undefined) {
                $scope.var.loading = true;
                $scope.var.subj = [];
                delete $http.defaults.headers.common['X-Requested-With'];
                httpServices.searchSubjects($scope.var.typeSearch.code_id, $scope.var.searchSubject.number, $scope.var.searchSubject.fioAndName, $scope);
            } else {
                alert("Не выбран тип субъекта!");
            }
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
            var url = DOMAIN + '/nka_net3/subject/add';
            subject.subjectType = angular.copy($scope.var.subjtype);
            $http.post(url, subject).catch(function (message) {
                alert(JSON.stringify(message.data));
            });
            $scope.var.subj = {};
        };

        $scope.updateSubject = function (subject) {
            var url = DOMAIN + '/nka_net3/subject/update';
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
    }]);

/**
 * Created by belonovich on 19.02.2015.
 */

'use strict';


angular.module('assetsApp')
    .controller('DocCtrl', ["$scope", "$http", "$location", function ($scope,$http, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    $scope.var = {
        doctypes:[
            {id: 1, name: 'Авизо'},
            {id: 2, name: 'Акт'},
            {id: 3, name: 'Вид на жительство '},
            {id: 4, name: 'Выписка'},
            {id: 5, name: 'Государственный акт'},
            {id: 6, name: 'Доверенность'},
            {id: 7, name: 'Договор (соглашение)'},
            {id: 8, name: 'Заявление'},
            {id: 9, name: 'Землеустроительное дело'} ,
            {id: 10, name: 'Иной документ'},
            {id: 11, name: 'Определение'},
            {id: 12, name: 'Паспорт'},
            {id: 13, name: 'Предписание'},
            {id: 14, name: 'Приговор'},
            {id: 15, name: 'Приказ'},
            {id: 16, name: 'Протокол'},
            {id: 17, name: 'Разрешение'},
            {id: 18, name: 'Регистрационное удостоверение'},
            {id: 19, name: 'Решение'},
            {id: 20, name: 'Сведения'},
            {id: 21, name: 'Свидетельство'},
            {id: 15, name: 'Справка'},
            {id: 16, name: 'Технический паспорт'},
            {id: 17, name: 'Уведомление'},
            {id: 18, name: 'Удостоверение'},
            {id: 19, name: 'Указ'},
            {id: 20, name: 'Указание'},
            {id: 21, name: 'Устав'}
        ]
    }

}]);

/**
 * Created by belonovich on 26.02.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('ItemsCtrl', ["$scope", "$http", "$location", function ($scope,$http, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }]);

/**
 * Created by belonovich on 11.02.2015.
 */

'use strict';

angular.module('assetsApp').factory('httpServices', ["DOMAIN", function (DOMAIN) {
  var httpServices = {};

  var XMLHttpFactories = [
    function () {
      return new XMLHttpRequest()
    },
    function () {
      return new ActiveXObject("Msxml2.XMLHTTP")
    },
    function () {
      return new ActiveXObject("Msxml3.XMLHTTP")
    },
    function () {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }
  ];

  var createXMLHTTPObject = function () {
    var xmlhttp = false;
    for (var i = 0; i < XMLHttpFactories.length; i++) {
      try {
        xmlhttp = XMLHttpFactories[i]();
      }
      catch (e) {
        continue;
      }
      break;
    }
    return xmlhttp;
  };


  httpServices.updateSubject = function (subject) {
    var url = DOMAIN+'/nka_net3/subject/update';
    var params = "?";
    var method = "PUT";
    for (var index in subject) {
      if (index != "bothRegDate" && index != "datestart") {
        params += "" + index + "=" + subject[index] + "&";
      } else {
        if (subject[index] != null) {
          params += "" + index + "=" + subject[index].valueOf() + "&";
        }
      }
    }
    var http = createXMLHTTPObject();
    http.open(method, url + params, true);
    http.send();
  };

  httpServices.searchSubjects = function (id, number, fio, scope) {
    var url = DOMAIN+'/nka_net3/subject/search';
    var params = "?" + "type=" + id + "&" + "number=" + number + "&" + "name=" + fio;
    var method = "GET";
    var http = createXMLHTTPObject();
    http.open(method, url + params, true);
    http.send();
    return http.onreadystatechange = function () {
      if (http.readyState == 4) {
        scope.var.loading = false;
        if (http.status == 200) {
          scope.var.subjects = JSON.parse(http.responseText);
          scope.var.showSubjectsTable = true;
          if(scope.var.subjects.length == 0) {
            scope.var.showSubjectsTable = false;
          }
          scope.$apply();
        }
      }
    }
  };

  httpServices.searchPass= function ( number, id, scope) {
    var url = DOMAIN+'/nka_net3/subject/mvd';
    var params = "?" + "seriesAndNumber=" + number + "&" + "idNumber=" + id;
    var method = "GET";
    var http = createXMLHTTPObject();
    http.open(method, url + params, true);
    http.send();
    return http.onreadystatechange = function () {
      if (http.readyState == 4) {
        scope.var.loading = false;
        if (http.status == 200) {
          scope.var.subjects = JSON.parse(http.responseText);
          scope.var.showSubjectsTable = true;
          if(scope.var.subjects.length == 0) {
            scope.var.showSubjectsTable = false;
          }
          scope.$apply();
        }
      }
    }
  };
  httpServices.addSubject = function (subject) {
    var url = DOMAIN+'/nka_net3/subject/add';
    var params = "?";
    var method = "POST";
    var http = createXMLHTTPObject();
    http.open(method, url + params, true);
    http.send(JSON.stringify(subject));
  };
  return httpServices;
}]);

/**
 * Created by belonovich on 06.03.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('CatalogCtrl', ["$scope", "$http", "$location", "DOMAIN", function ($scope,$http, $location, DOMAIN) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.item = {analytic_type: null};
        $scope.showCatalog = false;
        $scope.modalCatalog = {};
        $scope.showNewCatalog = false;
        $scope.selectedType = null;
        $scope.selectedItem = null;

        $scope.modal = function(s){
            $scope.selectedItem = s.code_id;
            $scope.modalCatalog = angular.copy(s);
            $scope.showCatalog = !$scope.showCatalog;
        };

        $scope.init = function () {
           $scope.loadTypes();
        };

        $scope.loadTypes = function(){
            $scope.showLoading = true;
            $http.get(DOMAIN+"/nka_net3/catalog/get_all_types")
                .then(function (res) {
                    $scope.catalogTypes = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadCatalogs = function(analytic_type){
            $scope.selectedType = analytic_type;
                $scope.showLoading = true;
            $http.get( DOMAIN+"/nka_net3/catalog/get_catalogs_by_type" ,{
                params:{"type": analytic_type}
            })
                .then(function (res) {
                    $scope.catalog = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
            $scope.item.analytic_type = analytic_type;
        };

        $scope.deleteCatalog = function(item){
            if(confirm("Вы действительно хотите удалить запись?")){
                $scope.showCatalog = false;
                $scope.showLoading = true;
                $http.delete(DOMAIN+"/nka_net3/catalog/delete_catalog_by_id",{
                    params:{"analytic_type": item.analytic_type, "code_id": item.code_id}
                })
                    .then(function (res) {
                        $scope.catalog = res.data;
                        $scope.showLoading = false;
                    }).catch(function(response) {
                        $scope.showLoading = false;
                        alert('Ошибка сервера');
                });
                $scope.showCatalog = false;
            }
        };

        $scope.deleteType = function(item){
            if(confirm("Вы действительно хотите удалить запись?")){
                $scope.showLoading = true;
                $http.delete(DOMAIN+"/nka_net3/catalog/deleted_type_by_id",{
                    params:{"analytic_type": item}
                })
                    .then(function (res) {
                        $scope.loadTypes();
                        $scope.showLoading = false;
                    }).catch(function(response) {
                        $scope.showLoading = false;
                        alert('Ошибка сервера');
                    });
            }
        };

        $scope.updateCatalog = function(item){
            if(confirm("Сохранить изменения?")){
                $scope.showLoading = true;
                $http.put(DOMAIN+"/nka_net3/catalog/update_catalog",{
                        "analytic_type": item.analytic_type,
                        "code_id": item.code_id,
                        "code_name": item.code_name,
                        "code_short_name": item.code_short_name,
                        "n_prm1": item.n_prm1,
                        "v_prm1": item.v_prm1,
                        "status": item.status,
                        "parent_code" : item.parent_code,
                        "unitmeasure": item.unitmeasure
                    }).then(function (res) {
                        $scope.catalog = res.data;
                        $scope.showLoading = false;
                    }).catch(function(response) {
                        $scope.showLoading = false;
                        alert('Ошибка сервера');
                    });
                $scope.showCatalog = false;
            }
        };

        $scope.modalNewCatalog = function(){
            if($scope.item.analytic_type != null){
                $scope.showNewCatalog = !$scope.showNewCatalog;
            }else{
                alert("Не выбран тип");
            }
        };

        $scope.modalNewType = function(){
            $scope.showNewType = !$scope.showNewType;
        };

        $scope.addNewCatalog = function(item){
            $scope.showLoading = true;
            $http.post(DOMAIN+"/nka_net3/catalog/add_catalog",{
                    "analytic_type": item.analytic_type,
                    "code_id": item.code_id,
                    "code_name": item.code_name,
                    "code_short_name": item.code_short_name,
                    "n_prm1": item.n_prm1,
                    "v_prm1": item.v_prm1,
                    "status": item.status,
                    "parent_code" : item.parent_code,
                    "unitmeasure": item.unitmeasure
                }).then(function (res) {
                    $scope.catalog = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
            $scope.showNewCatalog = false;
        };

        $scope.addNewType = function(item){
            $scope.showLoading = true;
            $http.post(DOMAIN+"/nka_net3/catalog/add_catalog_type",
              {
                    "analytic_type": item.analytic_type,
                    "analyticTypeName": item.analyticTypeName,
                    "status": item.status
              }).then(function (res) {
                    $scope.loadTypes();
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
            $scope.showNewType = false;
        };
    }]);

/**
 * Created by belonovich on 31.03.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('DependencyCtrl', ["$scope", "$http", "$location", "DOMAIN", function ($scope, $http, $location, DOMAIN) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.catalogTypes = {};

        $scope.currentParentId = null;

        $scope.selectedParentItem = null;

        $scope.currentDependencyId = null;

        $scope.init = function () {
            $scope.loadTypes();
        };

        $scope.loadTypes = function () {
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/catalog/get_all_types"
            ).then(function (res) {
                    $scope.catalogTypes = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadDependency = function (parentId) {
            $scope.selectedParentId = parentId;
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalog_dependency_by_parent_id", {
                params: {parentId: parentId}
            }).then(function (res) {
                $scope.catalogDependency = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.showListDependency = function (id) {
            $scope.selectedParentId = id;
            $scope.showListTypes = true;
        };

        $scope.addDependency = function (id) {
            $scope.showLoading = true;
            $http.post(DOMAIN + "/nka_net3/catalog/add_analytic_dependency", {
                parentAnalyticTypeId: $scope.selectedParentId,
                analyticTypeId: id
            }).then(function (res) {
                $scope.catalogDependency = res.data;
                $scope.showLoading = false;
                $scope.showListTypes = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.deleteDependencyType = function (id) {
            $scope.showLoading = true;
            $http.delete(DOMAIN + "/nka_net3/catalog/delete_analytic_dependency", {
                params: {id: id}
            }).then(
                function (res) {
                    $scope.catalogDependency = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadCatalogItems = function (id, selected, dependencyId) {
            $scope.showLoading = true;
            $scope.selectedDependedType = selected;
            $scope.currentDependencyId = dependencyId;
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalogs_by_type", {
                params: {type: id}
            }).then(function (res) {
                $scope.parentCatalog = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.loadDependedItem = function (id) {
            $scope.showLoading = true;
            $scope.selectedParentItem = id;
            $http.get(DOMAIN + "/nka_net3/catalog/get_analytic_depended_item", {
                params: {
                    id: id,
                    type: $scope.selectedDependedType,
                    parentType: $scope.selectedParentId
                }
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.deleteDependedData = function (codeId) {
            $scope.showLoading = true;
            $http.delete(DOMAIN + "/nka_net3/catalog/delete_dependency_data", {
                params: {
                    idDependency: $scope.currentDependencyId,
                    idCode: codeId,
                    idParentCode: $scope.selectedParentItem
                }
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.showListItem = function (id) {
            $scope.selectedParentItem = id;
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalogs_by_type", {
                params: {
                    type: $scope.selectedDependedType
                }
            }).then(function (res) {
                $scope.listItems = res.data;
                $scope.showLoading = false;
                $scope.showListItems = true;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.addDependedItem = function (codeId) {
            $scope.showLoading = true;
            $http.post(DOMAIN + "/nka_net3/catalog/add_dependency_data", {
                dependencyId: $scope.currentDependencyId,
                analyticCode: codeId,
                parentAnalyticCode: $scope.selectedParentItem
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
                $scope.showListItems = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

    }]);
/**
 * Created by belonovich on 28.04.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('TestCtrl', ["$scope", "$http", "$location", function ($scope,$http, $location) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
    }]);