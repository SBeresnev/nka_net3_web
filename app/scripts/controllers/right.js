/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, DOMAIN, WEBDOM) {

    kendo.culture("ru-RU");

   ///////////////////////////////kendo window property/////////////////////////////////////////////////////////////////

    $scope.mainGridOptions = {

        dataSource: { data : null},

        dataBound: function() {  this.expandRow(this.tbody.find("tr.k-master-row").first()); },

        scrollable: false,
        sortable: true,
        resizable: true,

        columns: [

        {field: "right_id", title: "ID", width:'60px'},

        {field: "right_type_name", title: "Вид права:"},

        {field: "right_entity_type_name", title: "<center>Объект операции  <br> (сущность)</center>"},

        {field: "right_count_type_name", title: "<center>Тип права по числу <br> правообладателей</center>"},

        {field: "begin_date", title: "<center> Дата <br> возникновения права</center>", template:"#= kendo.toString(kendo.parseDate(new Date(begin_date)), 'dd-MM-yyyy') #"},

        {field: "end_date", title: "<center> Дата <br>прекращения права</center>", template:"#= kendo.toString(kendo.parseDate(new Date(end_date)), 'dd-MM-yyyy') #"},

        {field: "bindedObj.object_name", title: "Имя объекта"} ,

        {title: "Тип объекта:", template: "#= bindedObj.objectType.code_name #" }

        ]
    };

    $scope.detailOwnersOptions = function(dataItem) {
        return {
            dataSource: {
                data: dataItem.rightOwners
            },

            scrollable: false,
            sortable: true,
            columns: [
                {title:"Имя/название правообладателя:", template: "#= data.owner.fullname === undefined?data.owner.surname+' '+data.owner.firstname+' '+data.owner.fathername:data.owner.fullname#" },
                {field:"owner.address", title:"Адресс правообладателя:" },
                {title:"Тип субъекта:", template: "#= data.owner.dtype=='private'?'физ. лицо':'юр. лицо'#" },
                {title:"Доля в праве:", template: "#= data.numerator_part+''+(data.denominator_part == 1 ?'':'/'+data.denominator_part) #" },
                {field: "date_in", title: "Дата прекращения доли:", template:"#= kendo.toString(kendo.parseDate(new Date(data.date_in)), 'dd-MM-yyyy') #"},
                {field: "date_out", title: "Дата прекращения доли:", template:"#= kendo.toString(kendo.parseDate(new Date(data.date_out)), 'dd-MM-yyyy') #"}
            ]
        };
    };

    ////////////////////////////common window///////////////////////////////////////////////////////////////////////////

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.urlmodObj = WEBDOM + '//#/object';

    $scope.DlgOptions = {width: "1300px", height: "500px", modal: true, actions: [ "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.start_date = new Date();

    $scope.end_date = '';

    $scope.tabNum = 1 ;

    $scope.tabClasses = ["","","","",""];

    $scope.sel_subject = [];  ///// субъект поиска

    $scope.sel_oject = [];    ///// объект поиска

    $scope.sel_buffer = [];   ///// данные буфера

    $scope.checked=[];

    $scope.var = {

        loading: false,

        rightDetail:{},

        rightsDataSearch: {},

        rightsDataTrnsform: {}

    };

    $scope.dict = {

        rightEntityTypes : [],

        rightTypes : [],

        rightCountTypes : [],


        operTypes : [],

        operSubTypes : [],

        operBases : []


    };

    /////////////////////////////// Init block ///////////////////////////////////////////////////////////////////////

    $scope.init = function () {

        $scope.var.loading = true;

        $scope.rightsDataSearchTabHide = true;


        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightCountType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightCountTypes = res.data;

        });


        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightEntityType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightEntityTypes = res.data;

        });


        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightTypes = res.data;

            $scope.var.loading = false;

        });




    };

    $scope.initOper = function(){


        if ( $scope.dict.operTypes.length == 0) {

            $scope.var.loading = true;

            $scope.var.url = DOMAIN + "/nka_net3/catalog/operationType";

            $http.get($scope.var.url).then(function (res) {

                $scope.dict.operTypes = res.data;

                $scope.var.loading = false;

                //$scope.dict.curoprTyp = $scope.dict.operTypes.find(function(value){ return value.code_name == this.curType ;},{curType:"Государственная регистрация"});

            });
        }

        if ($scope.dict.operSubTypes.length == 0) {

            $scope.var.loading = true;

            $scope.var.url = DOMAIN + "/nka_net3/catalog/operationSubType";

            $http.get($scope.var.url).then(function (res) {

                $scope.dict.operSubTypes = res.data;

                $scope.var.loading = false;

                //$scope.dict.curoprSubTyp = $scope.dict.operSubTypes.find(function(value){ return value.code_name == this.curType;},{curType:"Создание/возникновение"});

            });
        }

        if ($scope.dict.operBases.length == 0) {

            $scope.var.loading = true;

            $scope.var.url = DOMAIN + "/nka_net3/catalog/operationBase";

            $http.get($scope.var.url).then(function (res) {

                $scope.dict.operBases = res.data;

                $scope.var.loading = false;

                //$scope.dict.curoprBase = $scope.dict.operBases.find(function(value){ return value.code_name == this.curType;},{curType:"Купля-продажа"});

            });
        }


    };

    /////////////////////////////// Search block ///////////////////////////////////////////////////////////////////////

    $scope.rightSearch = function(){

        $scope.rightstDataSearchTabHide=true;

        $scope.var.rightsDataSearch = [];

        $scope.sel_buffer = [];

        $scope.checked=[];

        var pos =  $scope.sbj_class.indexOf("active");

        pos == -1 ? $scope.sel_subject[$scope.tabNum] = {} : $scope.sel_oject[$scope.tabNum] = {};

        $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids="+ $scope.nullIfundefine($scope.sel_oject[$scope.tabNum].obj_id) + "&person_id=" +  $scope.nullIfundefine($scope.sel_subject[$scope.tabNum].subjectId);

        $scope.urlSearch = "http://localhost:8080/nka_net3/right/getRightObjectPerson?obj_ids=&person_id=2942"; // потом удалить


        $http.get($scope.urlSearch).success(function (res) {

            $scope.var.rightsDataSearch = res;

            $scope.rightsDataSearchTabHide=false;


            $scope.var.rightsDataTrnsform = $scope.transformRight();

            $scope.mainGridOptions.dataSource.data = $scope.var.rightsDataTrnsform;

            $scope.mainGridOptions.dataSource.data.forEach(function(value) {$scope.fillDictName(value); $scope.getAddress(value.bindedObj);});

            $scope.sel_subject[$scope.tabNum] = $scope.var.rightsDataSearch[0].owner; // потом удалить

        }).error(function (data, status, header, config) {

            swal("Error", data.message , "error");

        });


    };

    $scope.getAddress = function (obj, callback){

        $scope.var.loading = true;

        obj.adr_num == null ? obj.adr_num ='' : true;

        $scope.var.url = DOMAIN + "/nka_net3/address/findDestAddress?address_id=" + obj.address_id + "&adr_num=" + obj.adr_num;

        $http.get($scope.var.url).then(function (res) {

            obj.address = res.data.adr;

            if(callback){ callback(); }

            $scope.var.loading = false;
        });

    };

    /////////////////////////////// Filter operation block /////////////////////////////////////////////////////////////


    $scope.transformRight = function(){

        var myMap = new Map();

        $scope.var.rightsDataSearch.forEach(function(value){

                var item = {};

                angular.copy( value, item);

                var right_map = myMap.get(item.right.right_id);

                  var right = item.right;

                  delete item['right'];

                if (typeof right_map === 'undefined') {

                    right["rightOwners"] = new Array(item);  //item.omit('right');

                    myMap.set(right.right_id, right);

                } else {


                    right_map["rightOwners"].push(item);

                    myMap.set(right.right_id, right_map);

                }

            } )


        return Array.from(myMap.values()) ;

    };


    /////////////////////////////// Filter operation block /////////////////////////////////////////////////////////////

    $scope.setEntityType = function() {

        var subType = {};

        $scope.var.url = DOMAIN + "/nka_net3/catalog/childCodeAndType?id=" + this.nullIfundefine(this.dict.curentTyp.code_id)+ "&childType=" + this.nullIfundefine(this.dict.curentTyp.analytic_type) +"&parentType=" + this.nullIfundefine(this.dict.rightTypes[0].analytic_type);

        $http.get($scope.var.url).then(function (res) {

            subType = res.data;

            $scope.dict.filterRightTypes = $scope.dict.rightTypes.filter($scope.filterType,{curType:subType});

        });

    };

    $scope.setCountType = function(){

        var subType = {};

        $scope.var.url = DOMAIN + "/nka_net3/catalog/childCodeAndType?id=" + this.nullIfundefine(this.dict.currgtCountTyp.code_id)+ "&childType=" + this.nullIfundefine(this.dict.currgtCountTyp.analytic_type) +"&parentType=" + this.nullIfundefine(this.dict.rightTypes[0].analytic_type);

        $http.get($scope.var.url).then(function (res) {

            subType = res.data;

            $scope.dict.filterRightTypes = $scope.dict.filterRightTypes.filter($scope.filterType,{curType:subType});

        });


    };

    $scope.setOperFiletr = function() {

        var subType = {};

        var baseType = {};

        $scope.var.url = DOMAIN + "/nka_net3/catalog/childCodeAndType?id=" + this.nullIfundefine(this.dict.curoprTyp.code_id)+ "&childType=" + this.nullIfundefine(this.dict.curoprTyp.analytic_type) +"&parentType=" + this.nullIfundefine(this.dict.operSubTypes[0].analytic_type);

        $http.get($scope.var.url).then(function (res) {

            subType = res.data;

            $scope.dict.filterSubTypes = $scope.dict.operSubTypes.filter($scope.filterType,{curType:subType} );

        });


        $scope.var.url = DOMAIN + "/nka_net3/catalog/childCodeAndType?id=" + this.nullIfundefine(this.dict.curoprTyp.code_id)+ "&childType=" + this.nullIfundefine(this.dict.curoprTyp.analytic_type) +"&parentType=" + this.nullIfundefine(this.dict.operBases[0].analytic_type);

        $http.get($scope.var.url).then(function (res) {

            baseType = res.data;

            $scope.dict.filterBases = $scope.dict.operBases.filter($scope.filterType,{curType:baseType} );

        });
    };

    $scope.setSubFiletr = function(){

        var baseType = {};

        $scope.var.url = DOMAIN + "/nka_net3/catalog/childCodeAndType?id=" + this.nullIfundefine(this.dict.curoprSubTyp.code_id)+ "&childType=" + this.nullIfundefine(this.dict.curoprSubTyp.analytic_type) +"&parentType=" + this.nullIfundefine(this.dict.operBases[0].analytic_type);

        $http.get($scope.var.url).then(function (res) {

            baseType = res.data;

            $scope.dict.filterBases = $scope.dict.filterBases.filter($scope.filterType,{curType:baseType} );

        });


    };

    //////////////////////////// Modal for Objects and Subjects/////////////////////////////////////////////////////////

    $scope.oSearch = function () {

        var pos =  $scope.sbj_class.indexOf("active");

        /*******************************************correct subj form************************************************************/

        pos == -1 ? $scope.objOpen() : $scope.sbjOpen();

        /*************************************************************************************************************************/

    };

    $scope.objOpen = function () {

        $scope.DlgOptions.title = "Objects";

        $scope.objwindow.setOptions($scope.DlgOptions);

        $scope.objwindow.center();

        $scope.objwindow.element.children(".k-content-frame").contents().find(".header")[0].style.display="none";

        sessionStorage.setItem('objObj',JSON.stringify({}));

        var modInst =  $scope.objwindow.open();

    };

    $scope.sbjOpen = function () {

        $scope.DlgOptions.title = "Subjects";

        $scope.sbjwindow.setOptions($scope.DlgOptions);

        $scope.sbjwindow.center();

        $scope.sbjwindow.element.children(".k-content-frame").contents().find(".header")[0].style.display="none";

        sessionStorage.setItem('sbjObj',JSON.stringify({}));

        var modInst =  $scope.sbjwindow.open();

    };

    $scope.cobjSearch = function () {

        var sel_object_test = JSON.parse(sessionStorage.getItem("objObj"));

         $scope.sel_object[$scope.tabNum] = sel_object_test;

    };

    $scope.csubSearch = function () {

        var sel_subject_test = JSON.parse(sessionStorage.getItem("sbjObj"));

        if (sel_subject_test.dtype == "private") {

            sel_subject_test.fullname = sel_subject_test.surname + ' ' + sel_subject_test.firstname + ' ' + sel_subject_test.fathername

        }

        $scope.sel_subject[$scope.tabNum] = sel_subject_test;


    };

    ///////////////////////////// Service part //////////////////////////////////////////////////////////////

    $scope.getTabClass = function (tabN) {

        return tabClasses[tabN];

    };

    $scope.getTabPaneClass = function (tabN) {

        return "tab-pane " + tabClasses[tabN];

    };

    $scope.setActiveTab = function (tabN) {

        initTabs();

        $scope.tabNum = tabN;

        tabClasses[tabN] = "active";

    };

    $scope.nullIfundefine = function(obj){

        return obj === undefined ? '' : obj;

    };

    $scope.BufferChange = function(rec){

        if($scope.checked[rec.right_id]){

            $scope.sel_buffer.push(rec);


        } else {

            var idx = $scope.sel_buffer.indexOf(rec);

            $scope.sel_buffer.splice(idx,1);

        }

    };

    $scope.fillDictName = function(right){

        right.right_type_name = $scope.dict.rightTypes.find(this.initType,{curType:right.right_type}).code_name;

        right.right_entity_type_name = $scope.dict.rightEntityTypes.find(this.initType,{curType:right.right_entity_type}).code_name;

        right.right_count_type_name = $scope.dict.rightCountTypes.find(this.initType,{curType:right.right_count_type}).code_name;

    }

    $scope.detailModal = function(right, index_arg){

            var trans_value = {};

            $scope.fillDictName(right);

            right["curownidx"]=index_arg;

            $scope.var.rightDetail = right;

            if (right.bindedObj.address === undefined)
            {
                $scope.getAddress(right.bindedObj, $scope.dispalyModal('#rgtModal'));

            } else
            {
                $scope.dispalyModal('#rgtModal');
            }



    };

    $scope.dispalyModal = function(modid) {

        var myElement = angular.element(document.querySelector(modid));

        myElement.modal("show");

    };

    $scope.filterType = function(value){

        return this.curType.some(function(parValue){ return parValue.parentAnalyticCode == this.curType;} , {curType:value.code_id});

    };

    $scope.initType = function(value){

        return value.code_id == this.curType;

    };


    $scope.setActiveTab(1);

    function initTabs() {

        tabClasses = ["","","","",""];

    }


});


