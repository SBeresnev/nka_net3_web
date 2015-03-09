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

        $scope.showCatalog = false;

        $scope.modal = function(s){
            $scope.modalCatalog = angular.copy(s);
            $scope.showCatalog = !$scope.showCatalog
        }

        $scope.init = function () {
            $http.get(DOMAIN+"/nka_net3/catalog/get_all_types")
                .then(function (res) {
                    $scope.catalogTypes = res.data;
                });

        };
        $scope.loadCatalogs = function(analytic_type){
            $http.get(DOMAIN+"/nka_net3/catalog/get_catalogs_by_type",{
                params:{"type": analytic_type}
            })
                .then(function (res) {
                    $scope.catalog = res.data;
                });
        }

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

        }
        $scope.updateCatalog = function(item){
            if(confirm("Сохранить изменения?")){
                $http.delete(DOMAIN+"/nka_net3/catalog/delete_catalog_by_id",{
                    params:{
                        "analytic_type": item.analytic_type,
                        "code_id": item.code_id,
                        "code_name": item.code_name,
                        "code_short_name": item.code_short_name}
                })
                    .then(function (res) {
                        $scope.catalog = res.data;
                    });
                $scope.modal();
            }
        }
    });
