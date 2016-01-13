/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, DOMAIN, WEBDOM) {

    kendo.culture("ru-RU");

   ///////////////////////////////kendo grid property/////////////////////////////////////////////////////////////////

    $scope.mainGridOptions = {

        dataSource: { data : null},

        scrollable: false,

        sortable: true,

        resizable: true,

        columns: [

        {field: "bufer", title: "Буфер/Редактировать", template: '<input type="checkbox"  class="inputtd" ng-click="BufferChange(dataItem, $event)" ng-model="checked[mainGridOptions.curTabNum][dataItem.right_id]">'},

        {field: "right_id", title: "ID", width:'60px'},

        {field: "right_type_name", title: "Вид права:"},

        {field: "right_entity_type_name", title: "<center>Объект операции  <br> (сущность)</center>"},

        {field: "right_count_type_name", title: "<center>Тип права по числу <br> правообладателей</center>"},

        {field: "begin_date", title: "<center> Дата <br> возникновения права</center>", template:"#= begin_date!=null?kendo.toString(kendo.parseDate(new Date(begin_date)), 'dd-MM-yyyy'):'' #"},

        {field: "end_date", title: "<center> Дата <br>прекращения права</center>", template:"#=  end_date!=null?kendo.toString(kendo.parseDate(new Date(end_date)), 'dd-MM-yyyy'):'' #"},

        {field: "bindedObj.object_name", title: "Имя объекта"} ,

        {title: "Тип объекта:", template: "#= bindedObj.objectType.code_name #" },

        {title: "&nbsp", template: '<span class="btn btn-default" ng-hide="mainGridOptions.curTabNum==1" ng-click="OnDeleteClick(dataItem)">Delete</span>'}


        ]
    };

    $scope.detailOwnersOptions = function(dataItem) { return {

            dataSource: { data: dataItem === undefined ? null : dataItem.rightOwners },

            scrollable: false,

            sortable: true,

            resizable: true,

            columns: [

                {title:"Имя/название правообладателя", template: "#= data.owner.fullname === undefined?data.owner.surname+' '+data.owner.firstname+' '+data.owner.fathername:data.owner.fullname#" },

                {field:"owner.address", title:"Адресс правообладателя" },

                {title:"Тип субъекта", template: "#= data.owner.dtype=='private'?'физ. лицо':'юр. лицо'#" },

                {title:"Доля в праве", template: "#= data.numerator_part+''+(data.denominator_part == 1 ?'':'/'+data.denominator_part) #" },

                {field: "date_in", title: "Дата прекращения доли", template:"#= data.date_in!=null?kendo.toString(kendo.parseDate(new Date(data.date_in)), 'dd-MM-yyyy'):'' #"},

                {field: "date_out", title: "Дата прекращения доли", template:"#= data.date_out!=null?kendo.toString(kendo.parseDate(new Date(data.date_out)), 'dd-MM-yyyy'):'' #"}

            ]

        }; };

    //////////////////////////////////common window///////////////////////////////////////////////////////////////////////////

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.urlmodObj = WEBDOM + '//#/object';

    $scope.DlgOptions = {width: "1300px", height: "500px", modal: true, actions: [ "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.begin_date = new Date();

    $scope.end_date = '';

    $scope.tabNum = 1;

    $scope.tabClasses = ["","","","",""];

    $scope.sel_subject = [];  ///// субъект поиска

    $scope.sel_object = [];    ///// объект поиска

    $scope.sel_buffer = [];   ///// данные буфера

    $scope.edit_right = {};

    $scope.checked=Create2DArray(5);

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

        //$scope.sel_buffer = [];

        $scope.checked[$scope.tabNum]=[];

        var pos =  $scope.sbj_class.indexOf("active");

        pos == -1 ? $scope.sel_subject[$scope.tabNum] = {} : $scope.sel_object[$scope.tabNum] = {};

        $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids="+ $scope.nullIfundefine($scope.sel_object[$scope.tabNum].obj_id) + "&person_id=" +  $scope.nullIfundefine($scope.sel_subject[$scope.tabNum].subjectId);

        $scope.urlSearch = "http://localhost:8080/nka_net3/right/getRightObjectPerson?obj_ids=&person_id=2942"; // потом удалить


        $http.get($scope.urlSearch).success(function (res) {

            $scope.var.rightsDataSearch = res;

            $scope.rightsDataSearchTabHide=false;

            $scope.var.rightsDataTrnsform = $scope.transformRight();

            $scope.var.rightsDataTrnsform.forEach(function(value) {$scope.fillDictName(value); $scope.getAddress(value.bindedObj);});

            $scope.mainGridOptions.dataSource.data = $scope.var.rightsDataTrnsform;

            //$scope.mainGridOptions.dataSource.data.forEach(function(value) {$scope.fillDictName(value); $scope.getAddress(value.bindedObj);});

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

    $scope.setRightType =  function(){

        $scope.var.url = DOMAIN + "/nka_net3/catalog/get_analytic_depended_item?id=" + this.nullIfundefine($scope.dict.currgtTyp.code_id)+ "&type=1" + "&parentType="+this.nullIfundefine($scope.dict.currgtTyp.analytic_type);

        $http.get($scope.var.url).then(function (res) {

            var subType = {};

            subType = res.data;

            $scope.dict.rightFilterEntityTypes = $scope.dict.rightEntityTypes.filter($scope.filterCodeType,{curType:subType});

            $scope.dict.curentTyp = $scope.dict.rightFilterEntityTypes.find($scope.initType ,{curType:$scope.edit_right.right_entity_type});

        });

        $scope.var.url = DOMAIN + "/nka_net3/catalog/get_analytic_depended_item?id=" + this.nullIfundefine($scope.dict.currgtTyp.code_id)+ "&type=21" +"&parentType="+ this.nullIfundefine($scope.dict.currgtTyp.analytic_type);

        $http.get($scope.var.url).then(function (res) {

            var subType = {};

            subType = res.data;

            $scope.dict.rightFilterCountTypes = $scope.dict.rightCountTypes.filter($scope.filterCodeType,{curType:subType});

            $scope.dict.currgtCountTyp = $scope.dict.rightFilterCountTypes.find($scope.initType ,{curType:$scope.edit_right.right_count_type});

        });


    }

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

        if (this.nullIfundefine(sel_object_test) == null) { $scope.sel_object[$scope.tabNum] = sel_object_test; }

        /////////////////// for first only ////////////////////////////////////////////////////////////////////////////

        $scope.sel_param = $scope.sel_object[1].object_name + ';' + $scope.sel_object[1].address ;

    };

    $scope.csubSearch = function () {

        var sel_subject_test = JSON.parse(sessionStorage.getItem("sbjObj"));

        if (sel_subject_test.dtype == "private") { sel_subject_test.fullname = sel_subject_test.surname + ' ' + sel_subject_test.firstname + ' ' + sel_subject_test.fathername }

        $scope.sel_subject[$scope.tabNum] = sel_subject_test;

        /////////////////// for first only////////////////////////////////////////////////////////////////////////////

        $scope.sel_param = $scope.sel_subject[1].fullname ;


    };

    $scope.OnEditPanelTable = function (index, item) {

        $scope.selected = index;

        $scope.dict.currgtTyp = $scope.dict.rightTypes.find(this.initType ,{curType:$scope.edit_right.right_type});

        $scope.setRightType();

        /////////////////////////////////////////////////////////////////////

         $scope.edit_right.begin_date = new Date($scope.edit_right.begin_date);

         $scope.edit_right.end_date =  this.nullIfundefine($scope.edit_right.end_date) == null? null: new Date($scope.edit_right.end_date);

        //////////////////////////////////////////////////////////////////////

        $scope.edit_right.rightOwners[index].date_in = new Date($scope.edit_right.rightOwners[index].date_in);

        $scope.edit_right.rightOwners[index].date_out = this.nullIfundefine($scope.edit_right.rightOwners[index].date_out) == null? null: new Date($scope.edit_right.rightOwners[index].date_out);


        $scope.sel_object[$scope.tabNum] = $scope.edit_right.bindedObj;

        $scope.sel_object[$scope.tabNum].fullname = $scope.edit_right.bindedObj.object_name + '; '+$scope.edit_right.bindedObj.address;

        $scope.sel_subject[$scope.tabNum] = $scope.edit_right.rightOwners[index].owner;

        if ($scope.sel_subject[$scope.tabNum].dtype == "private") { $scope.sel_subject[$scope.tabNum].fullname = $scope.sel_subject[$scope.tabNum].surname + ' ' + $scope.sel_subject[$scope.tabNum].firstname + ' ' + $scope.sel_subject[$scope.tabNum].fathername }

    }

    ///////////////////////////// Bufer operation //////////////////////////////////////////////////////////////

    $scope.OnDeleteClick = function(rec){

        $scope.checked[$scope.tabNum][rec.right_id] = false;

        $scope.checked[$scope.tabNum-1][rec.right_id] = false;

        $scope.edit_right = {};

        var idx = $scope.sel_buffer.indexOf(rec);

        $scope.sel_buffer.splice(idx, 1);

    }

    $scope.BufferChange = function(rec, e){

        //var element = $(e.currentTarget);
        //row = element.closest("tr");

        if ($scope.tabNum == 1) {

            $scope.checked[$scope.tabNum+1][rec.right_id] = false;

            var item = $scope.var.rightsDataTrnsform.find(function (value) {return value.right_id == this.curType;}, {curType: rec.right_id});

            var idx = $scope.sel_buffer.indexOf(item);

            $scope.sel_buffer.splice(idx, 1);

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.sel_buffer.push($scope.var.rightsDataTrnsform.find(function (value) {
                    return value.right_id == this.curType;
                }, {curType: rec.right_id}));

              //row.addClass("k-state-selected");

            } else {

                 if ($scope.edit_right.right_id == rec.right_id )  {$scope.edit_right = {};}

              //row.removeClass("k-state-selected");

            }
        }

        if ($scope.tabNum == 2) {

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.edit_right = $scope.sel_buffer.find(function (value) { return value.right_id == this.curType;}, {curType: rec.right_id});
            } else
            {
                $scope.edit_right = {};
            }

            for (var item in $scope.checked[$scope.tabNum]  ) {

               if (item != rec.right_id) { $scope.checked[$scope.tabNum][item] = false;}

                }

        }

    };

    $scope.LoadBufer = function(){

        $scope.mainGridOptions.dataSource.data = $scope.sel_buffer;

        $scope.DlgOptions.title = "Buffer Obj";

        $scope.bufwindow.setOptions($scope.DlgOptions);

        $scope.bufwindow.center();

        var modInst =  $scope.bufwindow.open();

    };

    $scope.CloseBuffer = function(){

        $scope.mainGridOptions.dataSource.data = $scope.var.rightsDataTrnsform;

    };

    ///////////////////////////// Modal Window part ///////////////////////////////////////////////////////////

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

    ///////////////////////////// Service part /////////////////////////////////////////////////////////////////

    $scope.getTabClass = function (tabN) {

        return tabClasses[tabN];

    };

    $scope.getTabPaneClass = function (tabN) {

        return "tab-pane " + tabClasses[tabN];

    };

    $scope.setActiveTab = function (tabN) {

        initTabs();

        $scope.tabNum = tabN;

        $scope.mainGridOptions.curTabNum=tabN;

        tabClasses[tabN] = "active";

    };

    $scope.fillDictName = function(right){

        right.right_type_name = $scope.dict.rightTypes.find(this.initType,{curType:right.right_type}).code_name;

        right.right_entity_type_name = $scope.dict.rightEntityTypes.find(this.initType,{curType:right.right_entity_type}).code_name;

        right.right_count_type_name = $scope.dict.rightCountTypes.find(this.initType,{curType:right.right_count_type}).code_name;

    }

    $scope.filterType = function(value){

        return this.curType.some(function(parValue){ return parValue.parentAnalyticCode == this.curType;} , {curType:value.code_id});

    };

    $scope.filterCodeType = function(value){

        return this.curType.some(function(parValue){ return parValue.code_id == this.curType;} , {curType:value.code_id});

    };

    $scope.initType = function(value){

        return value.code_id == this.curType;

    };

    $scope.nullIfundefine = function(obj){

        return obj === undefined ? '' : obj;

    };

    $scope.timetoUTC = function(obj) {

        var sub_date = new Date(subject.bothRegDate);

        subject.bothRegDate = Date.UTC( sub_date.getFullYear(), sub_date.getMonth() , sub_date.getDate(), 0, 0, 0);


    }

    function Create2DArray(rows) {
        var arr = [];

        for (var i=0;i<rows;i++) {
            arr[i] = [];
        }

        return arr;
    }

    function initTabs() {

        tabClasses = ["","","","",""];

    }

    $scope.setActiveTab(1);

});


