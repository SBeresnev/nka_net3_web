/**
 * Created by belonovich on 06.03.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('DictCtrl', function ($scope,$http, $location, DOMAIN) {
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
                .then(function (res) {
                    $scope.catalogTypes = res.data;
                    $scope.showLoading = false;
                });
        };

        $scope.loadCatalogs = function(analytic_type){
            $scope.selectedType = analytic_type;
                $scope.showLoading = true;
            $http.get( DOMAIN+"/nka_net3/catalog/get_catalogs_by_type" ,{
                params:{"type": analytic_type}
            })
                .then(function (res) {
                    $scope.catalog = res.data;
                    $scope.showLoading = false;
                });
            $scope.item.analytic_type = analytic_type;
        };

        $scope.deleteCatalog = function(item){
            if(confirm("Вы действительно хотите удалить запись?")){
                $scope.showLoading = true;
                $http.delete(DOMAIN+"/nka_net3/catalog/delete_catalog_by_id",{
                    params:{"analytic_type": item.analytic_type, "code_id": item.code_id}
                })
                    .then(function (res) {
                        $scope.catalog = res.data;
                        $scope.showLoading = false;
                    });
                $scope.modal();
            }

        };

        $scope.deleteType = function(item){
            if(confirm("Вы действительно хотите удалить запись?")){
                $scope.showLoading = true;
                $http.delete(DOMAIN+"/nka_net3/catalog/deleted_type_by_id",{
                    params:{"analytic_type": item}
                })
                    .then(function (res) {
                        $scope.loadTypes();
                        $scope.showLoading = false;
                    });
            }

        };

        $scope.updateCatalog = function(item){
            if(confirm("Сохранить изменения?")){
                $scope.showLoading = true;
                $http.put(DOMAIN+"/nka_net3/catalog/update_catalog",{
                        "analytic_type": item.analytic_type,
                        "code_id": item.code_id,
                        "code_name": item.code_name,
                        "code_short_name": item.code_short_name,
                        "n_prm1": item.n_prm1,
                        "v_prm1": item.v_prm1,
                        "status": item.status,
                        "parent_code" : item.parent_code,
                        "unitmeasure": item.unitmeasure}
                )
                    .then(function (res) {
                        $scope.catalog = res.data;
                        $scope.showLoading = false;
                    });
                $scope.modal();
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
                    "analytic_type": item.analytic_type,
                    "code_id": item.code_id,
                    "code_name": item.code_name,
                    "code_short_name": item.code_short_name,
                    "n_prm1": item.n_prm1,
                    "v_prm1": item.v_prm1,
                    "status": item.status,
                    "parent_code" : item.parent_code,
                    "unitmeasure": item.unitmeasure}
            ).then(function (res) {
                    $scope.catalog = res.data;
                    $scope.showLoading = false;
                });
            $scope.modalNewCatalog();
        };

        $scope.addNewType = function(item){
            $scope.showLoading = true;
            $http.post(DOMAIN+"/nka_net3/catalog/add_catalog_type",
              {
                    "analytic_type": item.analytic_type,
                    "analyticTypeName": item.analyticTypeName,
                    "status": item.status
              }).then(function (res) {
                    $scope.loadTypes();
                    $scope.showLoading = false;
                });
            $scope.modalNewType();
        };
    });
