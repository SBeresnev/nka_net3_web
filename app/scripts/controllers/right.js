/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $location, $filter, DOMAIN) {

    $scope.tab1 = "This is first section";
    $scope.tab2 = "This is SECOND section";
    $scope.tab3 = "This is THIRD section";
    $scope.tab4 = "This is FOUTRH section";

    var tabClasses;


    initTabs();

    function initTabs() {
        tabClasses = ["","","","",""];
    }

    $scope.getTabClass = function (tabNum) {
        return tabClasses[tabNum];
    };

    $scope.getTabPaneClass = function (tabNum) {
        return "tab-pane " + tabClasses[tabNum];
    }

    $scope.setActiveTab = function (tabNum) {
        initTabs();
        tabClasses[tabNum] = "active";
    };

    $scope.setActiveTab(1);

    $scope.ddSelectOptions = [
        {
            text: 'Поиск по субъекту',
            value: 'objSearch'
        }, {
            text: 'Поиск по объекту',
            value: 'subjSearch'
        }
    ];

    $scope.ddSelectSelected = {
        text: "Поиск по субъекту",
        value: 'objSearch'
    };

});


