/**
 * Created by belonovich on 31.03.2015.
 */
'use strict';

angular.module('assetsApp')
    .controller('DependencyCtrl', function ($scope, $http, $location, DOMAIN) {
        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.catalogTypes = {};

        $scope.currentParentId = null;

        $scope.selectedParentItem = null;

        $scope.currentDependencyId = null;

        $scope.init = function () {
            $scope.loadTypes();
        };

        $scope.loadTypes = function () {
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/catalog/get_all_types"
            ).then(function (res) {
                    $scope.catalogTypes = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadDependency = function (parentId) {
            $scope.selectedParentId = parentId;
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalog_dependency_by_parent_id", {
                params: {parentId: parentId}
            }).then(function (res) {
                $scope.catalogDependency = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.showListDependency = function (id) {
            $scope.selectedParentId = id;
            $scope.showListTypes = true;
        };

        $scope.addDependency = function (id) {
            $scope.showLoading = true;
            $http.post(DOMAIN + "/nka_net3/catalog/add_analytic_dependency", {
                parentAnalyticTypeId: $scope.selectedParentId,
                analyticTypeId: id
            }).then(function (res) {
                $scope.catalogDependency = res.data;
                $scope.showLoading = false;
                $scope.showListTypes = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.deleteDependencyType = function (id) {
            $scope.showLoading = true;
            $http.delete(DOMAIN + "/nka_net3/catalog/delete_analytic_dependency", {
                params: {id: id}
            }).then(
                function (res) {
                    $scope.catalogDependency = res.data;
                    $scope.showLoading = false;
                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadCatalogItems = function (id, selected, dependencyId) {
            $scope.showLoading = true;
            $scope.selectedDependedType = selected;
            $scope.currentDependencyId = dependencyId;
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalogs_by_type", {
                params: {type: id}
            }).then(function (res) {
                $scope.parentCatalog = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.loadDependedItem = function (id) {
            $scope.showLoading = true;
            $scope.selectedParentItem = id;
            $http.get(DOMAIN + "/nka_net3/catalog/get_analytic_depended_item", {
                params: {
                    id: id,
                    type: $scope.selectedDependedType,
                    parentType: $scope.selectedParentId
                }
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.deleteDependedData = function (codeId) {
            $scope.showLoading = true;
            $http.delete(DOMAIN + "/nka_net3/catalog/delete_dependency_data", {
                params: {
                    idDependency: $scope.currentDependencyId,
                    idCode: codeId,
                    idParentCode: $scope.selectedParentItem
                }
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.showListItem = function (id) {
            $scope.selectedParentItem = id;
            $scope.showLoading = true;
            $http.get(DOMAIN + "/nka_net3/catalog/get_analytic_dependency_parent_item_by_id", {
                params: {
                    id: $scope.selectedDependedType
                }
            }).then(function (res) {
                $scope.listItems = res.data;
                $scope.showLoading = false;
                $scope.showListItems = true;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.addDependedItem = function (codeId) {
            $scope.showLoading = true;
            $http.post(DOMAIN + "/nka_net3/catalog/add_dependency_data", {
                dependencyId: $scope.currentDependencyId,
                analyticCode: codeId,
                parentAnalyticCode: $scope.selectedParentItem
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
                $scope.showListItems = false;
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

    });