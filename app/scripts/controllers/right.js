/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $location, $filter, DOMAIN, WEBDOM) {

    $scope.urlAddress = WEBDOM + '//#/subject';

    $scope.DlgOptions = {width: "1300px", height: "500px", modal: true, actions: ["Custom", "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.tabClasses;

    initTabs();

    function initTabs() {
        tabClasses = ["","","","",""];
    }

    $scope.osubSearch = function () {

        $scope.DlgOptions.title = "Subjects";

        /********correct subj form**********/

        $scope.window.element.children(".k-content-frame").contents().find(".header")[0].style.display="none";

        $scope.window.element.children(".k-content-frame").contents().find(".checkbox")[0].style.display="none";

        $scope.window.element.children(".k-content-frame").contents().find("input.btn")[0].style.display="none";

        $scope.window.element.children(".k-content-frame").contents().find("div.btn")[0].style.display="none";

        var btn_elem = $scope.window.element.children(".k-content-frame").contents().find("#push-subject-button");

        if ( btn_elem.length != 0 ) {

            btn_elem = btn_elem[0];

            btn_elem.id = "bind-subject-button";

            btn_elem.innerHTML = "Привязать";

            btn_elem._initialText = "Привязать";

            btn_elem.setAttribute("ng-click", "sessionStorage.setItem('sbjObj',JSON.stringify($scope.var.subj))");

        }

        /***************************************/


        $scope.window.setOptions($scope.DlgOptions);

        $scope.window.center();  // open dailog in center of screen

        $scope.window.open();

    }

    $scope.csubSearch = function () {

        var toSend = JSON.parse(sessionStorage.getItem("sbjObj"));

        $scope.var.subj.address = toSend == null ? $scope.var.subj.address : toSend.adr;

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


