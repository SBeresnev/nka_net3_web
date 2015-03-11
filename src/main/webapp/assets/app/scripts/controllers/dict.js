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
        $scope.modal = function(s){
            $scope.modalCatalog = angular.copy(s);
            $scope.showCatalog = !$scope.showCatalog
        };

        $scope.init = function () {
           $scope.loadTypes();
        };

        $scope.loadTypes = function(){
            $http.get(DOMAIN+"/nka_net3/catalog/get_all_types")
                .then(function (res) {
                    $scope.catalogTypes = res.data;
                });
        }

        $scope.loadCatalogs = function(analytic_type){
            $http.get(DOMAIN+"/nka_net3/catalog/get_catalogs_by_type",{
                params:{"type": analytic_type}
            })
                .then(function (res) {
                    $scope.catalog = res.data;
                });
            $scope.item.analytic_type = analytic_type;
        };

        $scope.deleteCatalog = function(item){
            if(confirm("Вы действительно хотите удалить запись?")){
                $http.delete(DOMAIN+"/nka_net3/catalog/delete_catalog_by_id",{
                    params:{"analytic_type": item.analytic_type, "code_id": item.code_id}
                })
                    .then(function (res) {
                        $scope.catalog = res.data;
                    });
                $scope.modal();
            }

        };

        $scope.deleteType = function(item){
            if(confirm("Вы действительно хотите удалить запись?")){
                $http.delete(DOMAIN+"/nka_net3/catalog/deleted_type_by_id",{
                    params:{"analytic_type": item}
                })
                    .then(function (res) {
                        $scope.loadTypes();
                    });
            }

        };

        $scope.updateCatalog = function(item){
            if(confirm("Сохранить изменения?")){
                $http.get(DOMAIN+"/nka_net3/catalog/update_catalog",{
                    params:{
                        "analytic_type": item.analytic_type,
                        "code_id": item.code_id,
                        "code_name": item.code_name,
                        "code_short_name": item.code_short_name,
                        "n_prm1": item.n_prm1,
                        "v_prm1": item.v_prm1,
                        "status": item.status,
                        "parent_code" : item.parent_code,
                        "unitmeasure": item.unitmeasure}
                })
                    .then(function (res) {
                        $scope.catalog = res.data;
                    });
                $scope.modal();
            }
        };

        $scope.modalNewCatalog = function(){
            if($scope.item.analytic_type != null){
                $scope.showNewCatalog = ! $scope.showNewCatalog;
            }else{
                alert("Не выбран тип")
            }

        };

        $scope.modalNewType = function(){
            $scope.showNewType = !$scope.showNewType;
        };

        $scope.addNewCatalog = function(item){
            $http.get(DOMAIN+"/nka_net3/catalog/add_catalog",{
                params:{
                    "analytic_type": item.analytic_type,
                    "code_id": item.code_id,
                    "code_name": item.code_name,
                    "code_short_name": item.code_short_name,
                    "n_prm1": item.n_prm1,
                    "v_prm1": item.v_prm1,
                    "status": item.status,
                    "parent_code" : item.parent_code,
                    "unitmeasure": item.unitmeasure}
            })
                .then(function (res) {
                    $scope.catalog = res.data;
                });
            $scope.modalNewCatalog();
        };
        $scope.addNewType = function(item){
            $http.get(DOMAIN+"/nka_net3/catalog/add_catalog_type",{
                params:{
                    "analytic_type": item.analytic_type,
                    "analyticTypeName": item.analyticTypeName,
                    "status": item.status}
            })
                .then(function (res) {
                    $scope.loadTypes();
                });
            $scope.modalNewType();
        };
    });
