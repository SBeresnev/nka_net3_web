/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $location, DOMAIN, WEBDOM) {

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.sel_subject = '';

    $scope.DlgOptions = {width: "1300px", height: "500px", modal: true, actions: ["Custom", "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.tabClasses;

    initTabs();

    function initTabs() {
        tabClasses = ["","","","",""];
    }

    $scope.osubSearch = function () {

        $scope.DlgOptions.title = "Subjects";

        /********correct subj form**********/

        $scope.sbjwindow.element.children(".k-content-frame").contents().find(".header")[0].style.display="none";

        /***************************************/

        sessionStorage.setItem('sbjObj',JSON.stringify({}));

        $scope.sbjwindow.setOptions($scope.DlgOptions);

        $scope.sbjwindow.center();

        var modInst =  $scope.sbjwindow.open();

    }

    $scope.csubSearch = function () {


        var sel_subject_test = JSON.parse(sessionStorage.getItem("sbjObj"));

        if (sel_subject_test.dtype == "private") {

            sel_subject_test.fullname = sel_subject_test.surname + ' ' + sel_subject_test.firstname + ' ' + sel_subject_test.fathername

        }

        $scope.sel_subject = sel_subject_test;

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


});


