/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $location, DOMAIN, WEBDOM) {

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.DlgOptions = {width: "1300px", height: "500px", modal: true, actions: ["Custom", "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.tabClasses = ["","","","",""];

    $scope.sel_subject = {};

    $scope.sel_oject = {};


    $scope.var = {

         rightstDataSearch: {}

    }


    $scope.init = function () {

        $scope.var.loading = true;

    };

    $scope.rightSearch = function(){

        var pos =  $scope.sbj_class.indexOf("active");

        pos == -1 ? $scope.sel_oject = {} : $scope.sel_subject = {};

        $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids="+ $scope.sel_oject.obj_id + "&person_id=" +  $scope.sel_subject.subjectId;

        $http.get($scope.url).then(function (res) {

            $scope.rightstDataSearch = res.data;

            $scope.rightstDataSearchTabShow=true;

        });


    }

    //////////////////////////// Modal for Subjects ////////////////////////////////////////////////////////

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

    //////////////////////////// Modal for Objects /////////////////////////////////////////////////////////

    $scope.oobjSearch = function () {}

    $scope.cobjSearch = function () {}

    ///////////////////////////// Service part //////////////////////////////////////////////////////////////

    $scope.getTabClass = function (tabNum) {
        return tabClasses[tabNum];
    };

    $scope.getTabPaneClass = function (tabNum) {
        return "tab-pane " + tabClasses[tabNum];
    }

    $scope.setActiveTab = function (tabNum) {

        initTabs();

        tabClasses[tabNum] = "active";

        switch(tabNum) {
            case 1:

                $scope.rightstDataSearchTabShow=true;
                $scope.rightstDataSearch = [];

                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;


        }

    };

    $scope.setActiveTab(1);

    function initTabs() {

        tabClasses = ["","","","",""];

    }

});


