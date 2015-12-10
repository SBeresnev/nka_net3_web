/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $location, DOMAIN, WEBDOM) {

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.DlgOptions = {width: "1300px", height: "500px", modal: true, actions: ["Custom", "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.tabClasses = ["","","","",""];

    $scope.sel_subject = {};

    $scope.sel_oject = {};

    $scope.sel_buffer = [];

    $scope.checked=[];

    $scope.var = {

         rightsDataSearch: {}

    }

    $scope.dict = {

        rightCountType : {},

        rightEntytyType : {},

        rightType : {}

    }


    $scope.init = function () {

        $scope.var.loading = true;

        $scope.rightsDataSearchTabHide = true;

        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightCountType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightCountType = res.data;

        });

        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightEntytyType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightEntytyType = res.data;

        });

        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightType = res.data;

        });

    };

    $scope.rightSearch = function(){

        $scope.rightstDataSearchTabHide=true;

        $scope.var.rightsDataSearch = [];


        var pos =  $scope.sbj_class.indexOf("active");

        pos == -1 ? $scope.sel_subject = {} : $scope.sel_oject = {};

        $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids="+ $scope.nullIfundefine($scope.sel_oject.obj_id) + "&person_id=" +  $scope.nullIfundefine($scope.sel_subject.subjectId);

        $scope.urlSearch = "http://localhost:8080/nka_net3/right/getRightObjectPerson?obj_ids=&person_id=2942"; // потом удалить


        $http.get($scope.urlSearch).success(function (res) {

            $scope.var.rightsDataSearch = res;

            $scope.rightsDataSearchTabHide=false;

            $scope.sel_subject = $scope.var.rightsDataSearch[0].owner; // потом удалить

        }).error(function (data, status, header, config) {

            swal("Error", data.message , "error");

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



                break;
            case 2:
                break;
            case 3:
                break;
            case 4:
                break;


        }

    };

    $scope.nullIfundefine = function(obj){

        return obj === undefined ? '' : obj;

    }

    $scope.setActiveTab(1);

    $scope.BufferChange = function(rec,index){

        if($scope.checked[index]){

            $scope.sel_buffer.push(rec);

            alert($scope.sel_buffer.length);

        } else {

            var idx = $scope.sel_buffer.indexOf(rec);

            $scope.sel_buffer.splice(idx,1);

            alert($scope.sel_buffer.length);

        }

        //(function(record){return $scope.checked[$index];},1);

    };

    function initTabs() {

        tabClasses = ["","","","",""];

    }

});


