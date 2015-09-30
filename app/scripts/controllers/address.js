/**
 * Created by beresnev on 30.09.2015.
 */

'use strict';

angular.module("assetsApp", [ "kendo.directives" ])
    .controller("AddressCtrl", function($scope){
        $scope.treeData = new kendo.data.HierarchicalDataSource({ data: [
            { text: "Item 1" },
            { text: "Item 2", items: [
                { text: "SubItem 2.1" },
                { text: "SubItem 2.2" }
            ] },
            { text: "Item 3" }
        ]});

        $scope.click = function(dataItem) {
            alert(dataItem.text);
        };

        function makeItem() {
            var txt = kendo.toString(new Date(), "HH:mm:ss");
            return { text: txt };
        };

        $scope.addAfter = function(item) {
            var array = item.parent();
            var index = array.indexOf(item);
            var newItem = makeItem();
            array.splice(index + 1, 0, newItem);
        };

        $scope.addBelow = function() {
            // can't get this to work by just modifying the data source
            // therefore we're using tree.append instead.
            var newItem = makeItem();
            $scope.tree.append(newItem, $scope.tree.select());
        };

        $scope.remove = function(item) {
            var array = item.parent();
            var index = array.indexOf(item);
            array.splice(index, 1);
        };
    })
