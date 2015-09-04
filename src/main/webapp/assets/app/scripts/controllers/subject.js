/**
 * Created by belonovich on 25.02.2015.
 */

'use strict';

angular.module('assetsApp')
    .controller('SubjectCtrl', function ($scope, $http, $location, httpServices, DOMAIN) {
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
                    $scope.var.showForms = true;
                });

            $http.get(DOMAIN + "/nka_net3/catalog/subjectTypes")
                .then(function (res) {
                    $scope.var.subjecttypes = res.data;
                    $scope.var.loading = false;
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
            $scope.pageSize = 4;
                if(inpt_hd!=null)
                {
                    inpt_hd.id='show-all';
                    inpt_hd.value = 'Показать всё';
                    inpt_hd.classList.remove("btn-warning");
                    inpt_hd.classList.add("btn-info");
                    filt.style.visibility = "hidden";
                }
            };

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
            } else {
                alert("Не выбран тип субъекта!");
            }
        };

        $scope.updateSubjectForm = function (subject) {
            $scope.var.subj = [];
            $scope.var.showForms = true;
            $scope.var.showSubjectsTable = false;
            if(subject.unp != null && subject.subjectType == null) {
                var subjPush = {
                    subjectId:null,
                    reestrdataID:null,
                    isOwner:null,
                    subjectType:
                    {
                        code_id:210,
                        analytic_type:110,
                        code_name:null,
                        code_short_name:null,
                        parent_code:200,
                        n_prm1:null,
                        v_prm1:"Регистр юридических лиц",
                        unitmeasure:null,
                        status:0,
                        catalogPk:
                        {
                            code_id:210,
                            analytic_type:110
                        }
                    },
                    dtype:"juridical",
                    subjectdataid:null,
                    fullname: subject.vnaim,
                    shortname:subject.vn,
                    regNumber:subject.unp,
                    unp:subject.unp,
                    orgRightForm:
                    {
                        code_id:subject.nkOpf,
                        analytic_type:210,
                        code_name:null,
                        code_short_name:null,
                        parent_code:null,
                        n_prm1:null,
                        v_prm1:null,
                        unitmeasure:null,
                        status:1,
                        catalogPk:
                        {
                            code_id:null,
                            analytic_type:210
                        }
                    },
                    bothRegDate:subject.regDate,
                    remark:null,
                    address:subject.fullAddress
                }
                subject = subjPush;
            }
            $scope.var.subjtype = subject.subjectType;
            $scope.var.subj = angular.copy(subject);
            $scope.var.subj.bothRegDate = new Date(angular.copy(subject).bothRegDate);
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
            } else {
                alert("Ошибочно заполненны поля!");
            }
        };

        $scope.searchUr = function () {

            /*if ($scope.validUnp()) {*/
                $scope.var.loading = true;
            $scope.var.showForms = false;
            $scope.var.showSubjectsTable = true;
            $scope.hiddenAll();
            $scope.flt1="";
                $scope.var.subjects = [];
                delete $http.defaults.headers.common['X-Requested-With'];
                httpServices.searchUr($scope.var.searchSubject.unp, $scope.var.searchSubject.nameUr, $scope);
            /*} else {
                alert("Ошибочно заполненны поля!");
            }*/
        };

        $scope.pushSubject = function (subject) {
            var url = DOMAIN + '/nka_net3/subject/add';
            subject.subjectType = angular.copy($scope.var.subjtype);
            console.log(JSON.stringify(subject));
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

        $scope.validUnp = function () {
          var exp = /^\d{9}$/;
          return exp.test($scope.var.searchSubject.unp);
        };
        $scope.unReg = function (subject) {
          return (subject.unRegDate == null);
        };
    });