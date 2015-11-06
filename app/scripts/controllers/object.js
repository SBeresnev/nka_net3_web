/**
 * Created by belonovich on 17.02.2015.
 */
angular.module('assetsApp')
    .controller('ObjectCtrl', function ($scope) {
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
    });
