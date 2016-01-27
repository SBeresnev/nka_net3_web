/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, DOMAIN, WEBDOM, rightvar, operationtvar) {

    kendo.culture("ru-RU");

    ///////////////////////////////kendo grid property/////////////////////////////////////////////////////////////////

    $scope.mainGridOptions = {

        dataSource: { data:[]},

        scrollable: false,

        sortable: true,

        resizable: true,

        columns: [

            {field: "bufer", title: "Действия <br> с правом", template: '<input type="checkbox"  class="inputtd" ng-click="BufferChange(dataItem, $event)" ng-model="checked[mainGridOptions.curTabNum][dataItem.right_id]">'},

            {field: "right_id", title: "ID"},

            {field: "right_type_name", title: "Вид права:"},

            {field: "right_entity_type_name", title: "<center>Объект операции  <br> (сущность)</center>"},

            {field: "right_count_type_name", title: "<center>Тип права по числу <br> правообладателей</center>"},

            {field: "begin_date", title: "<center> Дата <br> возникновения права</center>", template:"#= begin_date!=null?kendo.toString(kendo.parseDate(new Date(begin_date)), 'dd-MM-yyyy'):'' #"},

            {field: "end_date", title: "<center> Дата <br>прекращения права</center>", template:"#=  end_date!=null?kendo.toString(kendo.parseDate(new Date(end_date)), 'dd-MM-yyyy'):'' #"},

            {field: "bindedObj.object_name", title: "Имя объекта"} ,

            {title: "Тип объекта:", template: "#= bindedObj.objectType.code_name #" },

            {title: "", template: '<span class="btn btn-default" ng-hide="mainGridOptions.curTabNum==1" ng-click="OnDeleteClick(dataItem)">Удалить</span>'},

            {title: "Добавить", hidden: true ,template: '<span class="btn btn-default" ng-hide="mainGridOptions.curTabNum==1" ng-click="AppenLimClick(dataItem)">Добавить</span>'}

        ]
    };

    $scope.detailOwnersOptions = function(dataItem) { return {

        dataSource: { data: dataItem === undefined ? null : dataItem.rightOwners },

        scrollable: false,

        sortable: true,

        resizable: true,

        columns: [

            {title:"Имя/название правообладателя", template: "{{dataItem.owner.fullname === undefined? BeautyCast(dataItem.owner.surname,dataItem.owner.firstname,dataItem.owner.fathername):dataItem.owner.fullname}}" },

            {field:"owner.address", title:"Адресс правообладателя" },

            {title:"Тип субъекта", template: "#= data.owner.dtype=='private'?'физ. лицо':'юр. лицо'#" },

            {title:"Доля в праве", template: "#= data.numerator_part+''+(data.denominator_part == 1 ?'':'/'+data.denominator_part) #" },

            {field: "date_in", title: "Дата возникновения доли", template:"#= data.date_in!=null?kendo.toString(kendo.parseDate(new Date(data.date_in)), 'dd-MM-yyyy'):'' #"},

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

    $scope.sel_subject = [];              ///// субъект поиска, а так же субъект на форме

    $scope.sel_object = [];               ///// объект поиска, а так же объект на форме

    $scope.sel_buffer = [];               ///// данные буфера

    $scope.edit_right = {};               ///// право объекта редактирования

    $scope.form_edit_right = angular.copy(rightvar);    ///// право редактирования формы

    $scope.oper_right = angular.copy(operationtvar);    /////операции формы


    $scope.checked=Create2DArray(5);

    $scope.var = {

        loading: false,

        rightDetail:{},

        rightsDataSearch: [],

        rightsDataLimit:{}

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

       // $scope.detailOwnersOptions.BeautyCast() = $scope.BeautyCast;

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

        $scope.checked[$scope.tabNum]=[];

        var pos =  $scope.sbj_class.indexOf("active");

        pos == -1 ? $scope.sel_subject[$scope.tabNum] = {} : $scope.sel_object[$scope.tabNum] = {};

        $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids="+ $scope.emptyIfundefine($scope.sel_object[$scope.tabNum].obj_id) + "&person_id=" + $scope.emptyIfundefine($scope.sel_subject[$scope.tabNum].subjectId);

        $scope.var.loading = true;

        $http.get($scope.urlSearch).success(function (res) {

            $scope.var.loading = false;

            if (res.length == 0) return;

            $scope.var.rightsDataSearch = res;

            $scope.rightsDataSearchTabHide=false;

            $scope.var.rightsDataSearch.forEach(function(value) {$scope.fillDictName(value); $scope.getAddress(value.bindedObj);});

            $scope.mainGridOptions.dataSource.data = $scope.var.rightsDataSearch;

          //$scope.sel_subject[$scope.tabNum] = $scope.var.rightsDataSearch[0].owner; // потом удалить

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

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

    $scope.transformRight = function(t_value){

        var myMap = new Map();

        t_value.forEach(function(value){

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

        if ( sessionStorage.getItem("objObj") == JSON.stringify({})) return;

        var sel_object_test = JSON.parse(sessionStorage.getItem("objObj"));

        $scope.sel_object[$scope.tabNum] = sel_object_test;


        /////////////////// for first part only ////////////////////////////////////////////////////////////////////////////

        if ($scope.tabNum == 1) {

            if (this.nullIfundefine($scope.sel_object[1].obj_id)) {

                $scope.sel_param = $scope.sel_object[1].object_name + ';' + $scope.sel_object[1].address_dest.adr;
            }
        }

        /////////////////// for second part only ////////////////////////////////////////////////////////////////////////////

        if ($scope.tabNum == 2) {

            if (this.nullIfundefine($scope.sel_object[2].obj_id)) {

                $scope.form_edit_right.bindedObj = angular.copy($scope.sel_object[2]);

                $scope.form_edit_right.bindedObj.fullname = $scope.sel_object[2].object_name + ';' + $scope.sel_object[2].address_dest.adr;
            }
        }

    };

    $scope.csubSearch = function () {

        if ( sessionStorage.getItem("sbjObj") == JSON.stringify({})) return;

        var sel_subject_test = JSON.parse(sessionStorage.getItem("sbjObj"));

        if (sel_subject_test.dtype == "private") { sel_subject_test.fullname = (sel_subject_test.surname + ' ' + sel_subject_test.firstname + ' ' + sel_subject_test.fathername).replace(/null/g,'') }

        $scope.sel_subject[$scope.tabNum] = sel_subject_test;

        /////////////////// for first part only ////////////////////////////////////////////////////////////////////////////

        if($scope.tabNum == 1){$scope.sel_param = $scope.sel_subject[1].fullname.replace(/null/g,'')} ;

        /////////////////// for second part only ////////////////////////////////////////////////////////////////////////////

        if($scope.tabNum == 2){$scope.form_edit_right.rightOwner.owner = angular.copy($scope.sel_subject[2]);}


    };

    $scope.OnEditPanelTable = function (index, item) {

        $scope.selected = index;

        $scope.dict.currgtTyp = $scope.dict.rightTypes.find(this.initType ,{curType:$scope.edit_right.right_type});

        $scope.setRightType();

        /////////////////////////////////////////////////////////////////////

        $scope.form_edit_right.begin_date = new Date($scope.edit_right.begin_date);

        $scope.form_edit_right.end_date = this.nullIfundefine($scope.edit_right.end_date) == null? null: new Date($scope.edit_right.end_date);

        //////////////////////////////////////////////////////////////////////

        $scope.sel_object[$scope.tabNum] = angular.copy($scope.edit_right.bindedObj);

        $scope.sel_object[$scope.tabNum].fullname = $scope.edit_right.bindedObj.object_name + '; '+$scope.edit_right.bindedObj.address;

        $scope.form_edit_right.bindedObj =  angular.copy($scope.sel_object[$scope.tabNum]);

        //////////////////////////////////////////////////////////////////////

        $scope.sel_subject[$scope.tabNum] = angular.copy($scope.edit_right.rightOwners[index].owner);

        $scope.form_edit_right.rightOwner = angular.copy(item);


        $scope.form_edit_right.rightOwner.date_in = new Date($scope.edit_right.rightOwners[index].date_in);

        $scope.form_edit_right.rightOwner.date_out = this.nullIfundefine($scope.edit_right.rightOwners[index].date_out) == null? null: new Date($scope.edit_right.rightOwners[index].date_out);

        if ($scope.sel_subject[$scope.tabNum].dtype == "private")
        {

            $scope.form_edit_right.rightOwner.owner.fullname = $scope.sel_subject[$scope.tabNum].surname + ' ' + $scope.sel_subject[$scope.tabNum].firstname + ' ' + $scope.sel_subject[$scope.tabNum].fathername ;


        }

        //////////////////////////////комментарии ////////////////////////////////////////

        $scope.form_edit_right.ooper =  $scope.edit_right.ooper;

        $scope.form_edit_right.comments = $scope.edit_right.comments;

        //////////////////////////////другие поля ////////////////////////////////////////

        $scope.form_edit_right.right_type = $scope.edit_right.right_type;

        $scope.form_edit_right.right_type_name = $scope.edit_right.right_type_name;

        $scope.form_edit_right.right_count_type = $scope.edit_right.right_count_type;

        $scope.form_edit_right.right_count_type_name = $scope.edit_right.right_count_type_name;

        $scope.form_edit_right.right_entity_type = $scope.edit_right.right_entity_type;

        $scope.form_edit_right.right_entity_type_name = $scope.edit_right.right_entity_type_name;

        $scope.form_edit_right.right_id = $scope.edit_right.right_id;

        $scope.fillOper($scope.form_edit_right);

    }

    ///////////////////////////// Bufer and Limitation operation //////////////////////////////////////////////////////////////

    $scope.AppenLimClick = function(dataItem){

        var find_ind_lim  = $scope.form_edit_right.rightOwner.limit_rights.findIndex(function (value) {return value.right_id == this.curType;}, {curType:  dataItem.right_id});

        if ( find_ind_lim > -1) {

            $scope.form_edit_right.rightOwner.limit_rights[find_ind_lim] = dataItem;

        } else {  $scope.form_edit_right.rightOwner.limit_rights.push(dataItem); }

    }

    $scope.OnDeleteClick = function(rec){

        $scope.checked[$scope.tabNum][rec.right_id] = false;

        $scope.checked[$scope.tabNum-1][rec.right_id] = false;

        if ( rec.right_id == $scope.edit_right.right_id ) { $scope.edit_right = {}; }

        if ( rec.right_id == $scope.form_edit_right.right_id ) { $scope.CleanEditForm(); }

        var idx = $scope.sel_buffer.indexOf(rec);

        $scope.sel_buffer.splice(idx, 1);

    }

    $scope.BufferChange = function(rec, e){

        //var element = $(e.currentTarget);
        //row = element.closest("tr");
       // var objectFound = array[elementPos];

        if ($scope.tabNum == 1) {

            $scope.checked[$scope.tabNum+1][rec.right_id] = false;

            var item = $scope.var.rightsDataSearch.find(function (value) {return value.right_id == this.curType;}, {curType: rec.right_id});

            var idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curType;}, {curType: rec.right_id});

            idx != -1 ? $scope.sel_buffer.splice(idx, 1) : null;

            /// очистка если выбираем тот же в случае редактирования
            if(item.right_id == $scope.form_edit_right.right_id ) {

                $scope.CleanEditForm();

                $scope.edit_right = {} ;
            }

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.sel_buffer.push(item);

                //row.addClass("k-state-selected");

            } else {

                if ($scope.edit_right.right_id == rec.right_id )
                 {
                     $scope.edit_right = {};

                     $scope.CleanEditForm();
                 }

                //row.removeClass("k-state-selected");

            }
        }

        if ($scope.tabNum == 2) {

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.edit_right = $scope.sel_buffer.find(function (value) { return value.right_id == this.curType;}, {curType: rec.right_id});

            } else
            {
                $scope.edit_right = {};

                $scope.CleanEditForm();
            }


            for (var item in $scope.checked[$scope.tabNum]  ) {

                if (item != rec.right_id) { $scope.checked[$scope.tabNum][item] = false;}

            }

        }

    };

    ///////////////////////////// Modal Window part ///////////////////////////////////////////////////////////

    $scope.LoadBuffer = function(){

        /////////////////////////// head rename ///////////////////////////

        //$("#kg thead [data-field=bufer] .k-link").html("Редактировать");

        //$("#kg").data("kendoGrid").columns[0].title = "Редактировать";

       // $("#kg").data("kendoGrid").refresh();

        ////////////////////////////////////////////////////////////////////

        $scope.mainGridOptions.columns[0].title = "Редактировать";

        $scope.mainGridOptions.dataSource.data = $scope.sel_buffer;

        $scope.DlgOptions.title = "Действия с правом";

        $scope.bufwindow.setOptions($scope.DlgOptions);

        $scope.bufwindow.center();

        var modInst =  $scope.bufwindow.open();


    };

    $scope.CloseBuffer = function(){

        $scope.mainGridOptions.dataSource.data = $scope.var.rightsDataSearch;

        $scope.mainGridOptions.columns[0].hidden = false;

        $scope.mainGridOptions.columns[9].hidden = false;

        $scope.mainGridOptions.columns[10].hidden = true;

    };

    $scope.getParentOwner = function(){

        if ($scope.nullIfundefine($scope.form_edit_right.rightOwner.parent_owner) == null) { swal("Info", 'Не указан идентификатор права родителя' , "warning"); return;}

        if ($scope.nullIfundefine($scope.form_edit_right.rightOwner.parent_owner_obj) != null) { $scope.dispalyModal('#rgtModal'); return;}

        var trans_value = {};

        $scope.var.loading = true;

        $scope.var.url = DOMAIN + "/nka_net3/right/getRightbyRightOwner?right_own_ids=" + $scope.form_edit_right.rightOwner.parent_owner;

        $http.get($scope.var.url).then(function (res) {

            if (res.data.length == 0) { $scope.var.loading = false; swal("Info", "Запись не существует или не активна" , "warning"); return;}

            $scope.var.rightDetail = res.data[0];

            $scope.fillDictName($scope.var.rightDetail);

            $scope.getAddress($scope.var.rightDetail.bindedObj);

            $scope.var.rightDetail.rightOwner = $scope.var.rightDetail.rightOwners[0];

            $scope.form_edit_right.rightOwner.parent_owner_obj = $scope.var.rightDetail;

            $scope.dispalyModal('#rgtModal');

            $scope.var.loading = false;
        });


    };

    $scope.setParentOwner = function(){};

    $scope.getLimitationRight = function(){

        $scope.mainGridOptions.columns[0].hidden = true;

        $scope.mainGridOptions.columns[9].hidden = true;

        $scope.mainGridOptions.columns[10].hidden = false;

        $scope.rightsDataLimit = $scope.sel_buffer.filter(function (value){ return ( value.right_type_name.search(/Ограничения/i)>=0 ) } );

        $scope.mainGridOptions.dataSource.data =  $scope.rightsDataLimit;

        $scope.DlgOptions.title = "Действия с ограничениями";

        $scope.bufwindow.setOptions($scope.DlgOptions);

        $scope.bufwindow.center();

        var modInst =  $scope.bufwindow.open();

        /////////////////////////// head rename ///////////////////////////

        //$("#kg thead [data-field=bufer] .k-link").html("Редактировать");

       // right_tyep в справочнике  200<=value.right_type && value.right_type<=400

       // $scope.var.loading = true;

       // $scope.var.url = DOMAIN + "/nka_net3/address/findDestAddress?address_id=" + obj.address_id + "&adr_num=" + obj.adr_num;

       // $http.get($scope.var.url).then(function (res) { $scope.var.loading = false; });

    };

    $scope.setLimitationRight = function(){

        $scope.mainGridOptions.columns[0].hidden = true;

        $scope.mainGridOptions.columns[9].hidden = true;

        $scope.mainGridOptions.columns[10].hidden = false;

        $scope.rightsDataLimit = $scope.sel_buffer.filter(function (value){ return ( value.right_type_name.search(/Ограничения/i)>=0 ) } );

        $scope.mainGridOptions.dataSource.data =  $scope.rightsDataLimit;

        $scope.DlgOptions.title = "Действия с ограничениями";

        $scope.bufwindow.setOptions($scope.DlgOptions);

        $scope.bufwindow.center();

        var modInst =  $scope.bufwindow.open();

    };

    $scope.dispalyOperations = function(modid){

        $scope.dispalyModal(modid);

    }

    $scope.dispalyModal = function(modid) {

        var myElement = angular.element(document.querySelector(modid));

        myElement.modal("show");

    };

    ///////////////////////////// Operation part /////////////////////////////////////////////////////////////////

    $scope.CleanEditForm = function() {

        $scope.form_edit_right = angular.copy(rightvar);


        $scope.dict.currgtTyp = '';

        $scope.dict.currgtCountTyp = '';

        $scope.dict.curentTyp = '';


        $scope.dict.curoprTyp = '';

        $scope.dict.curoprSubTyp = '';

        $scope.dict.curoprBase = '';

    }

    $scope.CleanForm = function(){

       $scope.sel_param = '';

       $scope.checked[$scope.tabNum]=[];

       $scope.var.rightsDataSearch = [];

       var pos =  $scope.sbj_class.indexOf("active");

       pos == -1 ? $scope.sel_subject[$scope.tabNum] = {} : $scope.sel_object[$scope.tabNum] = {};

       $scope.rightsDataSearchTabHide=true;

    }

    $scope.CreateRight = function() {

        var crete_right_obj = {};

        /////////////////////// блок подготовки edit_right -> crete_right_obj ///////////////////////

        $scope.preCreateRight();

        crete_right_obj = angular.copy($scope.edit_right);

        crete_right_obj = $scope.bringtoRight(crete_right_obj);

        $scope.var.loading = true;

        //sessionStorage.setItem('right', JSON.stringify($scope.crete_right_obj));

        /////////////////////////////////////////////////////////////////////////////////////////////

        $http.post(DOMAIN + "/nka_net3/right/addRight?", crete_right_obj).success(function (data, status, headers) {

            $scope.var.loading = false;

            crete_right_obj = data;

            $scope.postCreateRight(crete_right_obj);

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            swal("Error", data.message , "error");

        });


    }

    ///////////// создаем объект перед операциями ///////////////////////////////////////////////////////

    $scope.postCreateRight = function(ret_val){

        $scope.form_edit_right.right_id = ret_val.right_id;

        $scope.edit_right.right_id = ret_val.right_id;

        $scope.fillDictName($scope.edit_right);

        $scope.sel_object[$scope.tabNum] = ret_val.bindedObj;

        if ( $scope.nullIfundefine(ret_val.rightOwners[0]) != null  ){

            $scope.sel_subject[$scope.tabNum] = ret_val.rightOwners[0].owner;

            $scope.edit_right.rightOwners[0].right_owner_id = ret_val.rightOwners[0].right_owner_id

            $scope.form_edit_right.rightOwner.right_owner_id = ret_val.rightOwners[0].right_owner_id;
        }

    }

    $scope.preCreateRight = function() {

        $scope.edit_right = angular.copy(rightvar);

        //$scope.form_edit_right.bindedObj = {"org_id":100,"inventory_number":1,"square":null,"roomscount":null,"readiness":null,"object_name":"Водопровод","objectType":{"code_id":2,"analytic_type":2,"code_name":"Строение","code_short_name":"Строение","parent_code":null,"n_prm1":null,"v_prm1":"C(U)","unitmeasure":null,"status":1,"catalogPk":{"code_id":2,"analytic_type":2}},"use_purpose":null,"land_category":null,"obj_id":255,"ooper":{"ooperId":410,"declId":1182,"entytyType":2,"operType":1,"operSubtype":1,"reason":3100,"executor":2920,"regDate":1449503140000,"operDate":1449503140000,"parent_id_order":null,"parent_id_hist":null,"status":1},"conserv":null,"reg_type":1,"status":1,"bound_id":null,"obj_dest_id":84,"address_id":54055,"adr_num":null,"address_dest":{"address_id":54055,"adr_num":1502253,"adr":"Гомельская обл.,Буда-Кошелевский р-н,г. Буда-Кошелево, Базарный 1-й 2","soato":"3205501000"},"obj_id_inv":84,"cadastre_number":"111111111111111111"};

        $scope.form_edit_right.ooper = $scope.createOperObject();

        $scope.edit_right.begin_date = $scope.form_edit_right.begin_date;

        $scope.edit_right.end_date = $scope.form_edit_right.end_date;

        $scope.edit_right.bindedObj = angular.copy($scope.form_edit_right.bindedObj);

        $scope.edit_right.comments = $scope.form_edit_right.comments;

        $scope.edit_right.is_needed = $scope.form_edit_right.is_needed;

        $scope.edit_right.ooper =  $scope.form_edit_right.ooper;

        $scope.edit_right.right_count_type = $scope.form_edit_right.right_count_type = $scope.dict.currgtCountTyp.code_id;

        $scope.edit_right.right_entity_type = $scope.form_edit_right.right_entity_type = $scope.dict.curentTyp.code_id;

        $scope.edit_right.right_type = $scope.form_edit_right.right_type = $scope.dict.currgtTyp.code_id;

        $scope.edit_right.status = $scope.form_edit_right.status = 1;

        $scope.edit_right.is_needed = $scope.edit_right.is_needed ? 1 : 0;

        $scope.form_edit_right.rightOwner.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.status = 1;

        $scope.edit_right.rightOwners.push(angular.copy($scope.form_edit_right.rightOwner));

        return $scope.edit_right;
    }

    $scope.createOperObject = function(){

        $scope.oper_right = angular.copy(operationtvar);

        $scope.oper_right.entytyType = $scope.dict.curentTyp.code_id;

        $scope.oper_right.operType = $scope.dict.curoprTyp.code_id;

        $scope.oper_right.operSubtype = $scope.dict.curoprSubTyp.code_id;

        $scope.oper_right.reason = $scope.dict.curoprBase.code_id;

        $scope.oper_right.regDate = new Date();

        $scope.oper_right.operDate = new Date();

        $scope.oper_right.status = 1;

        return $scope.oper_right;

    }

   ///////////////////////////// Checks part /////////////////////////////////////////////////////////////////

    $scope.summCheckRightOwnersPart = function(rOwners){

        for(rOwner in rOwners){

           // rOwner.numerator_part;

           // rOwner.denominator_part;

        }

    }

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

    $scope.fillOper = function(right_own){

        $scope.dict.curoprTyp = $scope.dict.operTypes.find(this.initType,{curType:right_own.ooper.operType});

        $scope.dict.curoprSubTyp = $scope.dict.operSubTypes.find(this.initType,{curType:right_own.ooper.operSubtype});

        $scope.dict.curoprBase = $scope.dict.operBases.find(this.initType,{curType:right_own.ooper.reason});

        $scope.dict.filterSubTypes = [$scope.dict.curoprSubTyp];

        $scope.dict.filterBases = [$scope.dict.curoprBase];

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

    ////////////////////////  для приведения в хороший json формат ////////////////////////////////////////////////

    $scope.bringtoRight = function(item){

        delete item['rightOwner'];

        delete item['right_count_type_name'];

        delete item['right_entity_type_name'];

        delete item['right_type_name'];

        delete item['parent_owner_obj'];

        delete item.bindedObj['fullname'];

        item["rightOwners"] = $scope.normRightOwner($scope.edit_right);

        return item ;

    }

    $scope.normRightOwner = function(edit_right_val) {

        var norm_right_own = angular.copy(edit_right_val.rightOwners);

        for ( var item in norm_right_own) {

            var right_owner = angular.copy(norm_right_own[item]);

            delete norm_right_own[item]['parent_owner_obj'];

            delete norm_right_own[item]['owner'];

            norm_right_own[item]['owner'] = {subjectId:right_owner.owner.subjectId};

        }

        return norm_right_own;
    }

    $scope.ChgEntity = function(){

        $scope.pr_class = $scope.obj_class;

        $scope.obj_class = $scope.sbj_class;

        $scope.sbj_class = $scope.pr_class;

        $scope.CleanForm();

    }

    //////////////////////////////////////////////// служебные фунеции ////////////////////////////////////////////////

    $scope.nullIfundefine = function(obj){

        return obj === undefined ? null : obj;

    };

    $scope.emptyIfundefine = function(obj){

        return obj === undefined ? '' : obj;

    };

    $scope.timetoUTC = function(obj) {

        var sub_date = new Date(subject.bothRegDate);

        subject.bothRegDate = Date.UTC( sub_date.getFullYear(), sub_date.getMonth() , sub_date.getDate(), 0, 0, 0);


    };

    $scope.BeautyCast = function(var_one, var_two , var_three ) {

        return (var_one + ' ' + var_two +' '+ var_three).replace(/null/g,'').trim();

    };

    function Create2DArray(rows) {
        var arr = [];

        for (var i=0;i<rows;i++) {
            arr[i] = [];
        }

        return arr;
    };

    function initTabs() {

        tabClasses = ["","","","",""];

    };

    $scope.setActiveTab(1);

});


