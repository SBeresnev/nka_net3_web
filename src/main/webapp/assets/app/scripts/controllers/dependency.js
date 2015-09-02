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
           /* $http.get(DOMAIN + "/catalog/get_all_types"*/
            ).then(function (res) {
                    $scope.catalogTypes = res.data;
                    $scope.showLoading = false;
                    $scope.curPageDict = 0;
                    $scope.pageSizeDict = 3;
                    $scope.numberOfPagesDict = function() {
                        return Math.ceil($scope.catalogTypes.length / $scope.pageSizeDict);
                    };


                }).catch(function(response) {
                    $scope.showLoading = false;
                    alert('Ошибка сервера');
                });
        };

        $scope.loadDependency = function (parentId) {
            $scope.selectedParentId = parentId;
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalog_dependency_by_parent_id", {
           /* $http.get(DOMAIN + "/catalog/get_catalog_dependency_by_parent_id", {*/
                params: {parentId: parentId}
            }).then(function (res) {
                $scope.catalogDependency = res.data;
                $scope.loadCatalogItems(0,0,0);
                $scope.loadDependedItem(0);
                $scope.showLoading = false;
                $scope.curPageDepDict = 0;
                $scope.pageSizeDepDict = 3;
                $scope.numberOfPagesDepDict = function() {
                    return Math.ceil($scope.catalogDependency.length / $scope.pageSizeDepDict);
                };
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
            /*$http.post(DOMAIN + "/catalog/add_analytic_dependency", {*/
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
            /*$http.delete(DOMAIN + "/catalog/delete_analytic_dependency", {*/
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
           /* $http.get(DOMAIN + "/catalog/get_catalogs_by_type", {*/
                params: {type: id}
            }).then(function (res) {
                $scope.parentCatalog = res.data;
                $scope.showLoading = false;
                $scope.curPageParentDict = 0;
                $scope.pageSizeParentDict = 3;
                $scope.numberOfPagesParentDict = function() {
                    return Math.ceil($scope.parentCatalog.length / $scope.pageSizeParentDict);
                };
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.loadDependedItem = function (id) {
            $scope.showLoading = true;
            $scope.selectedParentItem = id;
            $http.get(DOMAIN + "/nka_net3/catalog/get_analytic_depended_item", {
           /* $http.get(DOMAIN + "/catalog/get_analytic_depended_item", {*/
                params: {
                    id: id,
                    type: $scope.selectedDependedType,
                    parentType: $scope.selectedParentId
                }
            }).then(function (res) {
                $scope.dependedCatalog = res.data;
                $scope.showLoading = false;
                $scope.curPageDependEl = 0;
                $scope.pageSizeDependEl = 3;
                $scope.numberOfPageDependEl = function() {
                    return Math.ceil($scope.dependedCatalog.length / $scope.pageSizeDependEl);
                };
            }).catch(function(response) {
                $scope.showLoading = false;
                alert('Ошибка сервера');
            });
        };

        $scope.deleteDependedData = function (codeId) {
            $scope.showLoading = true;
            $http.delete(DOMAIN + "/nka_net3/catalog/delete_dependency_data", {
            /*$http.delete(DOMAIN + "/catalog/delete_dependency_data", {*/
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
            $http.get(DOMAIN + "/nka_net3/catalog/get_catalogs_by_type", {
           /* $http.get(DOMAIN + "/catalog/get_catalogs_by_type", {*/
                params: {
                    type: $scope.selectedDependedType
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
           /* $http.post(DOMAIN + "/catalog/add_dependency_data", {*/
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

        $scope.loadAll = function(_id){
            var inpt_sh_id = 'show-all-' + _id;
            var inpt_hd_id = 'hide-all-' + _id;
            var inpt_sh = document.getElementById(inpt_sh_id);
            var inpt_hd = document.getElementById(inpt_hd_id);
            var filt = document.getElementById(_id);
            if(inpt_hd!=null)
            {
                inpt_hd.id=inpt_sh_id;
                inpt_hd.value = 'Показать всё';
                inpt_hd.classList.remove("btn-warning");
                inpt_hd.classList.add("btn-info");
                filt.style.visibility = "hidden";
                return true;
            } else {
                inpt_sh.id=inpt_hd_id;
                inpt_sh.value = 'Постранично';
                inpt_sh.classList.remove("btn-info");
                inpt_sh.classList.add("btn-warning");
                filt.style.visibility = "visible"
                return false;
            }
        };

        $scope.loadAllDictionary = function(_id) {
            if($scope.loadAll(_id)) {
                $scope.pageSizeDict = 3;
            } else {
                $scope.curPageDict = 0;
                $scope.pageSizeDict = $scope.catalogTypes.length;
            }
        };

        $scope.loadAllDictionaryDependency = function(_id) {
            if($scope.loadAll(_id)) {
                $scope.pageSizeDepDict = 3;
            } else {
                $scope.curPageDepDict = 0;
                $scope.pageSizeDepDict = $scope.catalogDependency.length;
            }
        };

        $scope.loadAllParentDictionary = function(_id) {
            if($scope.loadAll(_id)) {
                $scope.pageSizeParentDict = 3;
            } else {
                $scope.curPageParentDict = 0;
                $scope.pageSizeParentDict = $scope.parentCatalog.length;
            }
        };

        $scope.loadAllDependencyElement = function(_id) {
            if ($scope.loadAll(_id)) {
                $scope.pageSizeDependEl = 3;
            } else {
                $scope.curPageDependEl = 0;
                $scope.pageSizeDependEl = $scope.dependedCatalog.length;
            }
        }

    });


angular.module('assetsApp').filter('pagination', function()
{
    return function(input, start)
    {
        start = +start;
        return input.slice(start);
    };
});