/**
 * Created by belonovich on 19.02.2015.
 */

'use strict';


angular.module('assetsApp')
    .controller('DocCtrl', function ($scope,$http, $location) {
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

});
