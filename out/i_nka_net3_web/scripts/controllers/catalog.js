/**
 * Created by belonovich on 06.03.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('CatalogCtrl', function ($scope,$http, $location, DOMAIN) {
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
            /*$http.get(DOMAIN+"/catalog/get_all_types")*/
                .then(function (res) {
                    $scope.catalogTypes = res.data;
                    $scope.showLoading = false;
                    $scope.curPage = 0;
                    $scope.pageSize = 6;
                    $scope.numberOfPages = function() {
                        return Math.ceil($scope.catalogTypes.length / $scope.pageSize);
                    };

                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadCatalogs = function(analytic_type){
            $scope.selectedType = analytic_type;
                $scope.showLoading = true;
            $http.get( DOMAIN+"/nka_net3/catalog/get_catalogs_by_type" ,{
            /*$http.get( DOMAIN+"/catalog/get_catalogs_by_type" ,{*/
                params:{"type": analytic_type}
            })
                .then(function (res) {
                    $scope.catalog = res.data;
                    $scope.showLoading = false;
                    $scope.curPageSub = 0;
                    $scope.pageSizeSub = 3;
                    $scope.numberOfPagesSub = function() {
                        return Math.ceil($scope.catalog.length / $scope.pageSizeSub);
                    };

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
                /*$http.delete(DOMAIN+"/catalog/delete_catalog_by_id",{*/
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
                /*$http.delete(DOMAIN+"/catalog/deleted_type_by_id",{*/
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
                /*$http.put(DOMAIN+"/catalog/update_catalog",{*/
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
            /*$http.post(DOMAIN+"/catalog/add_catalog",{*/
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
            /*$http.post(DOMAIN+"/catalog/add_catalog_type",*/
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

        $scope.loadAll = function(){
            var inpt_sh = document.getElementById('show-all');
            var inpt_hd = document.getElementById('hide-all');
            var filt = document.getElementById('flt1');
            if(inpt_hd!=null)
            {
                inpt_hd.id='show-all';
                inpt_hd.value = 'Показать всё';
                inpt_hd.classList.remove("btn-warning");
                inpt_hd.classList.add("btn-info");
                $scope.pageSize = 6;
                filt.style.visibility = "hidden";
            } else {
                inpt_sh.id='hide-all';
                $scope.curPage = 0;
                inpt_sh.value = 'Скрыть всё';
                inpt_sh.classList.remove("btn-info");
                inpt_sh.classList.add("btn-warning");
                $scope.pageSize = $scope.catalogTypes.length;
                filt.style.visibility = "visible"
            }
        };

        $scope.loadAllSub = function(){
            var inpt_sh = document.getElementById('show-all-sub');
            var inpt_hd = document.getElementById('hide-all-sub');
            var filt = document.getElementById('flt2');
            if(inpt_hd!=null)
            {
                inpt_hd.id='show-all-sub';
                inpt_hd.value = 'Показать всё';
                inpt_hd.classList.remove("btn-warning");
                inpt_hd.classList.add("btn-info");
                $scope.pageSizeSub = 3;
                filt.style.visibility = "hidden"
            } else {
                inpt_sh.id='hide-all-sub';
                $scope.curPage = 0;
                inpt_sh.value = 'Скрыть всё';
                inpt_sh.classList.remove("btn-info");
                inpt_sh.classList.add("btn-warning");
                $scope.pageSizeSub = $scope.catalog.length;
                filt.style.visibility = "visible";
            }
        };

    });