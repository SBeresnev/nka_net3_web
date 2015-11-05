'use strict';

/**
 * @ngdoc function
 * @name treeViewApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the treeViewApp

 */
angular.module("assetsApp").controller("AddressCtrl", function($scope, $http, $location, DOMAIN){

    $scope.var = {

        url      :  '' ,

        ateForm :{parentAte: '' ,  nameAte  :  ''} ,
        streetForm :{street_name: '' ,  house_num  :  '', corp_num :  '' ,  room_num :  '' } ,
        parcelForm : {street_name: '' ,  house_num  :  '', elem_type_dep: null , lCoord:'', bCoord:'' },

        curAte    : {ate_id:'', ate_name:'', soato:'' },
        curStreet : {ate_id:'',  adr_num: '',  street_name:'', cord_num:'', fullStr:'' },
        curParcel : {ate_id:'',  adr_num: '', street_name:'', cord_num:'', lCoord:'', bCoord:'',  fullStr:''},

        fullStr:'',

        objPlaceDict:{},
        curObjPlace :{code_id:'', analytic_type:'', code_name: '', code_short_name:''},

        toSend : {address_id:'', adr_num: '', soato:'', adr :'' },

        parcelDataSearch : {} , // parcel search
        streetDataSearch : {} , // input street search
        ateDataSearch :{},      // input ate search

        ateData  : new kendo.data.HierarchicalDataSource($scope.ateData),             // tree search
        treeData : new kendo.data.HierarchicalDataSource($scope.treeData)


    };




    // $http.get('dao/ate.json').then(function(res){ $scope.var.treeData = res.data; $scope.var.ateDataSearch = res.data; $scope.var.ateData = res.data;});

    // $http.get('dao/street.json').then(function(res){ $scope.var.streetDataSearch = res.data; });

    $('ul.nav li').click(function(e) {

        var $this = $(this);

        $('ul.nav').find('a.active').last().removeClass('active')

        $this.find('a').addClass('active');
    });


    $scope.init = function () {

        $scope.var.ateDataSearch = [];

        $scope.var.streetDataSearch = [];

        $scope.var.parcelDataSearch = [];

        $scope.var.url = DOMAIN + "/nka_net3/address/getate?parent_id=";


        $http.get($scope.var.url).then(function (res) {

            $scope.var.treeData = res.data;


        });

        $scope.var.url = DOMAIN + "/nka_net3/catalog/elementTypeDepend";

        $http.get($scope.var.url).then(function (res) {

            $scope.var.objPlaceDict = res.data;

            $scope.var.curObjPlace =  $scope.var.objPlaceDict[0];

        });


    }

    //---------- clean block ------------//

    $scope.cleanAll = function() {

        $scope.cleanDataSearches();

        $scope.cleanAte();

        $scope.cleanStreet();

        $scope.cleanParcel();

    };

    $scope.cleanDataSearches = function() {

        $scope.var.parcelDataSearch = [];
        $scope.var.streetDataSearch = [];
        $scope.var.ateDataSearch = [];

    };

    $scope.cleanAte = function(){

        $scope.var.curAte = {ate_id:'', ate_name:'', soato:'' };

    };

    $scope.cleanStreet = function(){

        $scope.var.curStreet = {ate_id:'', street_name:'', cord_num:'', fullStr:'' };

    };

    $scope.cleanParcel = function(){

        $scope.var.curParcel = {ate_id:'', street_name:'', cord_num:'', lCoord:'', bCoord:'',  fullStr:''};

    };

    $scope.cleanAteForm = function(){

        $scope.var.ateForm = {parentAte: '' ,  nameAte  :  ''} ;

    };

    $scope.cleanStreetForm = function(){

        $scope.var.streetForm = {street_name: '' ,  house_num  :  '', corp_num :  '' ,  room_num :  '' } ;

    };

    $scope.cleanParcelForm = function(){

        $scope.var.parcelForm = {street_name: '' ,  house_num  :  '', elem_type_dep: null , lCoord:'', bCoord:'' };

    };


//---------- ate  block ------------//

    $scope.searchAte = function(){

        $scope.cleanStreetForm();

        $scope.cleanParcelForm();

        $scope.cleanStreet();

        $scope.cleanParcel();

        var myElement = angular.element(document.querySelector('#AteSearchID'));

        myElement.addClass("wait");

        $scope.var.ateDataSearch = [];

        $scope.var.url = DOMAIN + "/nka_net3/address/getAtebyName_apr?parent_id="+ $scope.var.curAte.ate_id + "&ate_name=" +  $scope.var.ateForm.nameAte.toString();

        $http.get($scope.var.url).then(function (res) {

            $scope.var.ateDataSearch = res.data;

            $scope.ateTabShow=true;

            myElement.removeClass("wait");

        });

    };

    $scope.getAte = function(item) {

        //$scope.cleanDataSearches();

        $scope.cleanStreetForm();

        $scope.cleanParcelForm();

        $scope.cleanStreet();

        $scope.cleanParcel();

        $scope.var.fullStr = '';

        $scope.var.curAte = getCurate(item);

        if (item.hasChildren) return;

        var myElement = angular.element(document.querySelector('#AteSearchID'));

        myElement.addClass("wait");

        $scope.var.ateData = [];

        $scope.var.url = DOMAIN + "/nka_net3/address/getate?parent_id="+item.ate_id.toString();

        $http.get($scope.var.url).then(function (res) {

            $scope.var.ateData = res.data;

            for (var i = 0; i <  $scope.var.ateData.length; i++) {

                $scope.addBelow($scope.var.ateData[i]);

            }

            myElement.removeClass("wait");

        });

    };

    $scope.addBelow = function(item) {

        var itm = {ate_id: item.ate_id, parentate_id:item.parentate_id, ate_name:kendo.toString(item.ate_name), soato: kendo.toString(item.soato)}

        $scope.tree.append(itm, $scope.tree.select());

    };

    $scope.bindAte = function(item) {

        $scope.var.fullStr = '';

        $scope.var.curAte.ate_id = item.ate_id;

        $scope.var.curAte.ate_name = item.parent_ate;

        $scope.var.curAte.soato = item.soato;

    };

//---------- street  block ------------//

    $scope.searchStreet = function(){

        $scope.cleanParcel();

        $scope.cleanParcelForm();

        $scope.var.streetDataSearch = [];

        if ( typeof $scope.var.curAte.ate_id == 'undefined' ) alert('Не указан АТЕ');

        if ( $scope.var.streetForm.house_num == null )  $scope.var.streetForm.house_num = '' ;

        if ( $scope.var.streetForm.street_name == null )  $scope.var.streetForm.street_name  = '' ;

        if ( $scope.var.streetForm.corp_num == null ) $scope.var.streetForm.corp_num = '';

        if ( $scope.var.streetForm.room_num == null ) $scope.var.streetForm.room_num = '';

        if ( $scope.var.streetForm.street_name.length < 1 )  return;

        $scope.var.url = DOMAIN + "/nka_net3/address/findHomeAddress?ate_id=" + $scope.var.curAte.ate_id + "&street_name=" +  $scope.var.streetForm.street_name  + "&house_num=" + $scope.var.streetForm.house_num + "&corp_num=" + $scope.var.streetForm.corp_num  + "&room_num=" + $scope.var.streetForm.room_num +  "&elem_type_dep=" + $scope.var.curObjPlace.code_id ;

        var myElement = angular.element(document.querySelector('#StreetSearchID'));

        myElement.addClass("wait");

        $http.get($scope.var.url).then(function (res) {

            $scope.var.streetDataSearch = res.data;

            myElement.removeClass("wait");

        });

    };

    $scope.getFormat = function(item){

        var cord_num_format = '';

        item.houseNum != null ? cord_num_format = item.houseNum.toString() : null;

        item.houseId != null ? cord_num_format = cord_num_format + item.houseId.toString() : null;

        item.corpNum != null ? cord_num_format = cord_num_format + "/" + item.corpNum.toString() : null ;

        item.roomNum != null ? cord_num_format = cord_num_format + " - " + item.roomNum.toString() : null ;

        item.roomId != null ? cord_num_format = cord_num_format + item.roomId.toString() : null ;

        return cord_num_format;

    };

    $scope.bindStreet = function(item) {

        $scope.var.fullStr = '';


        $scope.var.curStreet.ate_id = $scope.var.curAte.ate_id;

        $scope.var.curStreet.street_name = item.elementName;

        $scope.var.curStreet.cord_num =  $scope.getFormat(item);

        $scope.var.curStreet.fullStr =   $scope.var.curStreet.street_name + ' ' + $scope.var.curStreet.cord_num;


        $scope.var.fullStr = $scope.var.curStreet.fullStr;

        $scope.var.toSend.adr_num = item.adr_num;

    };

//---------- parcel  block ------------//

    $scope.searchParcel = function(){

        $scope.cleanStreet();

        $scope.cleanStreetForm();


        if ( typeof $scope.var.curAte.ate_id == 'undefined' ) alert('Не указан АТЕ');

        if ( $scope.var.parcelForm.house_num == null )  $scope.var.parcelForm.house_num = '' ;

        if ( $scope.var.parcelForm.street_name == null )  $scope.var.parcelForm.street_name  = '' ;

        $scope.var.url = DOMAIN + "/nka_net3/address/findParcelAddress?ate_id=" + $scope.var.curAte.ate_id + "&street_name=" +  $scope.var.parcelForm.street_name  + "&house_num=" + $scope.var.parcelForm.house_num + "&elem_type_dep=" + $scope.var.curObjPlace.code_id ;

        var myElement = angular.element(document.querySelector('#ParcelSearchID'));

        myElement.addClass("wait");

        $http.get($scope.var.url).then(function (res) {

            $scope.var.parcelDataSearch = res.data;

            myElement.removeClass("wait");

        });

    };

    $scope.bindParcel = function(item) {

        $scope.var.fullStr = '';

        $scope.var.curParcel.ate_id = $scope.var.curAte.ate_id;

        $scope.var.curParcel.street_name = item.elementName;

        $scope.var.curParcel.cord_num =  $scope.getFormat(item);

        $scope.var.curParcel.lCoord = item.lCoord;

        $scope.var.curParcel.bCoord = item.bCoord;

        $scope.var.curParcel.fullStr =   $scope.var.curParcel.street_name + ' ' + $scope.var.curParcel.cord_num;

        $scope.var.fullStr =  $scope.var.curParcel.fullStr;

        $scope.var.toSend.adr_num =  item.adr_num;



    };

    //---------- parcel  block ------------//
    $scope.bind = function(){

        var myElement = angular.element(document.querySelector('#AddressID'));

        $scope.var.toSend.adr = $scope.var.curAte.ate_name +' ' + $scope.var.fullStr;

        $scope.var.toSend.soato = $scope.var.curAte.soato ;

        myElement.addClass("wait");

        $http.post(DOMAIN + "/nka_net3/address/bindAddress?", $scope.var.toSend ).success(function (data, status, headers) {

            $scope.var.toSend = data;

            alert( $scope.var.toSend.address_id);

            myElement.removeClass("wait");

        }).error(function (data, status, header, config) {

            $scope.ServerResponse = alert('Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config);


        });

    }


    function getCurate(item){

        var cur_item = item;

        var ret_str = "";

        while (typeof cur_item != 'undefined')
        {
            ret_str = cur_item.ate_name+ "; " + ret_str;

            cur_item = cur_item.parentNode();
        }

        return {ate_id: item.ate_id, ate_name: ret_str , soato: item.soato } ;

    };

    /*
     function getCurate_(item, fate){

     if (typeof item.parentNode() != 'undefined')
     {
     fate =  getCurate(item.parentNode(), item.ate_name) + '; ' + fate;

     return fate;

     }else {

     return item.ate_name + '; ' + fate;
     }
     } */


})
