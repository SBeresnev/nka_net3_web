/**
 * Created by belonovich on 25.02.2015.
 */

'use strict';

angular.module('assetsApp').controller('SubjectCtrl',  function ($scope, $http, $location, $filter, $routeParams, httpServices, subjectvar, DOMAIN, WEBDOM) {

    kendo.culture("ru-RU");

    $scope.awesomeThings = [
        'HTML5 Boilerplate',
        'AngularJS',
        'Karma'
    ];

    $scope.typeMod = false ;  /* view mode */

    $scope.urlAddress = WEBDOM + '//#/address';

    $scope.var = {
        loading: false,
        states: '',
        sitizens: '',
        items: '',
        subjecttypes: '',
        subjects: [{label: 'loading'}]
    };

    function isEnoughType(value) {
        return value.code_short_name.toUpperCase() == "Граждане РБ (паспорт нового образца)".toUpperCase();
    }

    function isSitezens(value) {
        return value.code_short_name.toUpperCase() == "Беларусь".toUpperCase();
    }

    $scope.init = function () {

        $scope.typeMod = typeof($routeParams.typeMod) == 'undefined' ? false : true;

        $scope.var.loading = true;

        $scope.mvdSearch=false;

        $scope.urSearch=false;

        $http.get(DOMAIN + "/nka_net3/catalog/states").then(function (res) {
                $scope.var.states = res.data;
                $scope.var.sitizens = $scope.var.states.filter(isSitezens)[0];
                $scope.var.subj = {sitizens: $scope.var.sitizens};
                $scope.var.loading = false;
                $scope.var.showForms = false;
            });

        $http.get(DOMAIN + "/nka_net3/catalog/subjectTypes").then(function (res) {
                $scope.var.subjecttypes = res.data;
                $scope.var.loading = false;
                $scope.var.typeSearch = $scope.var.subjecttypes.filter(isEnoughType)[0];
                $scope.var.subjtype = $scope.var.typeSearch;
            });


    };

    $scope.loadAll = function(){
        var inpt_sh = document.getElementById('show-all');
        var inpt_hd = document.getElementById('hide-all');
        var filt = document.getElementById('flt1');
        $scope.hiddenAll();
        if(inpt_hd==null)
        {
            inpt_sh.id='hide-all';
            $scope.curPage = 0;
            inpt_sh.value = 'Скрыть всё';
            inpt_sh.classList.remove("btn-info");
            inpt_sh.classList.add("btn-warning");
            $scope.pageSize = $scope.var.subjects.length;
            filt.style.visibility = "visible"
        }
    };

    $scope.hiddenAll = function () {
        var inpt_hd = document.getElementById('hide-all');
        var filt = document.getElementById('flt1');
        $scope.pageSize = 3;
        if(inpt_hd!=null)
        {
            inpt_hd.id='show-all';
            inpt_hd.value = 'Показать всё';
            inpt_hd.classList.remove("btn-warning");
            inpt_hd.classList.add("btn-info");
            filt.style.visibility = "hidden";
        }
    };

    $scope.pushSubject = function (subject) {

        if ( $scope.var.subjtype.parent_code == 200 && !$scope.urSearch ) { swal("Error", "Добавление юр лиц запрещено" , "error");  return;}

        var url = DOMAIN + '/nka_net3/subject/add';

        $scope.timetoUTC(subject);

        console.log(JSON.stringify(subject));

        $http.post(url, subject).success(function (data, status, headers) {

            subject = data;

            $scope.updateSubjectForm(subject);

            swal("оk!", "", "success");

        }).error(function (data, status, header, config) {

            swal("Error", data.message , "error");

        });


    };

    $scope.updateSubject = function (subject) {

        var url = DOMAIN + '/nka_net3/subject/update';

        if(subject.subjectId == undefined ) { swal("Error", "Добавьте объект перед изменением либо воспользуйтесь стандартным поиском" , "error"); return; }

        $scope.timetoUTC(subject);

        $http.put(url, subject).success(function (data, status, headers) {

            subject = data;

            $scope.updateSubjectForm(subject);

            swal("оk!", "", "success");

        }).error(function (data, status, header, config) {

            swal("Error", data.message , "error");

        });


    };

    $scope.initSelect = function () {

        var butt = document.getElementById('add-subjects-id');

        butt.classList.remove("btn-warning");
        butt.classList.add("btn-primary");
        butt.value = 'Добавить новый';

        $scope.var.showForms=false;
        $scope.var.showSubjectsTable=false;

    }

    $scope.searchSubjects = function () {
        if ($scope.var.typeSearch != undefined) {
            $scope.var.loading = true;
            $scope.var.showForms = false;
            $scope.var.showSubjectsTable = true;
            $scope.hiddenAll();
            $scope.flt1="";
            $scope.var.subj = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchSubjects($scope.var.typeSearch.code_id, $scope.var.searchSubject.number, $scope.var.searchSubject.fioAndName, $scope);

            var butt = document.getElementById('add-subjects-id');
            butt.classList.remove("btn-warning");
            butt.classList.add("btn-primary");
            butt.value = 'Добавить новый';
        } else {

            swal("Error", "Не выбран тип субъекта!", "error");

        }
    };

    $scope.addSubjectsHide = function () {
        var showForms = $scope.var.showForms;
        var butt = document.getElementById('add-subjects-id');
        var val = butt.value;
        var hid = 'Скрыть', op = 'Добавить новый';

        $scope.var.subj = {};

        document.getElementById('push-subject-button').removeAttribute('disabled');

        if (!showForms && val == op) {
            $scope.var.showSubjectsTable = false;
            $scope.var.showForms = true;
            butt.classList.remove("btn-primary");
            butt.classList.add("btn-warning");
            butt.value = hid;

            $scope.var.sitizens = $scope.var.states.filter(isSitezens)[0];
            $scope.var.subj.sitizens = $scope.var.sitizens.code_id;

            butt.removeAttribute('disabled');

        } else if(showForms && val == hid){

            $scope.var.showForms = false;
            butt.classList.remove("btn-warning");
            butt.classList.add("btn-primary");
            butt.value = op;

        } else if (showForms && val == op) {

            $scope.var.showSubjectsTable = false;
            $scope.var.showForms = true;
            butt.classList.remove("btn-primary");
            butt.classList.add("btn-warning");
            butt.value = hid;

            $scope.var.sitizens = $scope.var.states.filter(isSitezens)[0];
            $scope.var.subj.sitizens = $scope.var.sitizens.code_id;

        }
    };

    $scope.updateSubjectForm = function (subject) {


        if($scope.unReg(subject)) {

            $scope.var.subj = {};

            $scope.subjectForm= angular.copy(subject);

            $scope.var.showForms = true;

            $scope.var.showSubjectsTable = false;

            subject = $scope.createJSON(subject);

            $scope.var.subjtype = $scope.var.subjecttypes.filter(function(v) {return v.code_id === subject.subjectType;})[0];

            $scope.var.subj = angular.copy(subject);

            $scope.var.subj.bothRegDate = new Date(angular.copy(subject).bothRegDate);

            var butt = document.getElementById('push-subject-button');


            if ($scope.mvdSearch || $scope.urSearch) {
                butt.removeAttribute('disabled', 'disabled');
            } else {
                butt.setAttribute('disabled', 'disabled');
            }

            if($scope.var.subj.address == null)
                $scope.var.sitizens = $scope.var.states.filter(isSitezens)[0];
            else
                $scope.var.sitizens =  $scope.var.states.filter(function(v) {
                    return v.code_id == subject.sitizens; })[0];

        }

        else return false;
    };

    $scope.searchPass = function () {

        if ($scope.validId() && $scope.validPass()) {
            $scope.var.loading = true;
            $scope.var.showForms = false;
            $scope.var.showSubjectsTable = true;
            $scope.hiddenAll();
            $scope.flt1="";
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchPass($scope.var.searchSubject.passSeriesAndNumber, $scope.var.searchSubject.idNumber, $scope);

            var butt = document.getElementById('add-subjects-id');
            butt.classList.remove("btn-warning");
            butt.classList.add("btn-primary");
            butt.value = 'Добавить новый';

        } else {

            swal("Error", "Ошибочно заполненны поля!", "error");

        }
    };

    $scope.searchUr = function () {
        var unp = $scope.var.searchSubject.unp;
        var nameUr = $scope.var.searchSubject.nameUr;
        if(!$scope.isFillingField(nameUr, unp))
            swal("Error", "Не заполненны поля!", "error");

        else if (unp.trim() != "" && !$scope.validUnp())
            swal("Error", "Ошибочно заполненны поля!", "error");

        else {
            $scope.var.loading = true;
            $scope.var.showForms = false;
            $scope.var.showSubjectsTable = true;
            $scope.hiddenAll();
            $scope.flt1 = "";
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchUr(unp, nameUr, $scope);

            var butt = document.getElementById('add-subjects-id');
            butt.classList.remove("btn-warning");
            butt.classList.add("btn-primary");
            butt.value = 'Добавить новый';

        }
    };

    $scope.numberOfPages = function () {
        return Math.ceil($scope.var.subjects.length / $scope.pageSize);
    };

    $scope.timetoUTC = function(subject) {

        var sub_date = new Date(subject.bothRegDate);

        subject.bothRegDate = Date.UTC( sub_date.getFullYear(), sub_date.getMonth() , sub_date.getDate(), 0, 0, 0);


    }

    $scope.validPass = function () {
        var exp = /^[A-Z,a-z]{2}(\d){7}$/;
        return exp.test($scope.var.searchSubject.passSeriesAndNumber);
    };

    $scope.validId = function () {
        var exp = /^(\d){7}[A-Z,a-z](\d){3}[A-Z,a-z]{2}(\d)$/;
        return exp.test($scope.var.searchSubject.idNumber);
    };

    $scope.validUnp = function () {
        var exp = /^\d{9}$/;
        return exp.test($scope.var.searchSubject.unp);
    };

    $scope.unReg = function (subject) {
        return (subject.unRegDate == null);
    };

    $scope.createJSON=function(subject) {
        if(subject.unp != null && subject.subjectType == null) {
            var subjPush = angular.copy(subjectvar);
            subjPush.fullname=subject.vnaim;
            subjPush.shortname=subject.vn;
            subjPush.regNumber=subject.unp;
            subjPush.unp=subject.unp;
            subjPush.orgRightForm.code_id=subject.nkOpf;
            subjPush.orgRightForm.catalogPk.code_id=subject.nkOpf;
            subjPush.orgRightForm.code_name=subject.opf;
            subjPush.bothRegDate = subject.regDate;
            subjPush.address=subject.fullAddress;

            subject = subjPush;
        }
        return subject;
    };

    $scope.disabledJrField = function (id) {
        return (200<id<400);
    };

    $scope.isFillingField = function (field1, field2) {
        return (!(field1.trim() == "" && field2.trim() == ""));
    }

    $scope.openAddress = function () {

        sessionStorage.setItem("addressObj",JSON.stringify([]));

        $scope.DlgOptions = {
            width: "1300px", height: "500px", modal: true,
            actions: ["Custom", "Minimize", "Maximize", "Close"],
            title: "Addresses", iframe: true, visible: false
        };

        $scope.window.element.children(".k-content-frame").contents().find(".header")[0].style.display="none";

        $scope.window.setOptions($scope.DlgOptions);

        $scope.window.center();  // open dailog in center of screen

        $scope.window.open();

    }

    $scope.closeAddress = function() {

        var toSend = JSON.parse(sessionStorage.getItem("addressObj"));

        $scope.var.subj.address = toSend == null ? $scope.var.subj.address : toSend.adr;

    }

    $scope.bind = function(){

      sessionStorage.setItem('sbjObj',JSON.stringify($scope.var.subj));

      swal("оk!", "", "success");

    }

});