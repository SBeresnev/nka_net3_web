/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, DOMAIN, WEBDOM, rightvar, dictvar ,operationtvar) {

    kendo.culture("ru-RU");


    $scope.anonymous = {
        "subjectId":1,"reestrdataID":1,"isOwner":1,"subjectType":110,
        "dtype":"private", "subjectdataid":1, "firstname":null,
        "surname":"аноним", "fathername":null, "sitizens":112,
        "bothRegDate":"1900-01-01T00:00:00.000Z","personalNumber":"АААААААААААААА",
        "address":null,"remark":null}

    ///////////////////////////////kendo grid property/////////////////////////////////////////////////////////////////

    $scope.limitGridOption = function(limdata, hide) {

        return {

            dataSource: {data: limdata},

            scrollable: false,

            sortable: true,

            resizable: true,

            navigatable: true,

            selectable: false,

            columns: [

                {field: "right_id", title: "ID"},

                {field: "right_type_name", title: "Вид права"},

                {field: "right_entity_type_name", title: "Вид права"},

                {
                    title: "Удалить",
                    hidden: !hide,
                    template: '<input type="image" src="images/deletion.jpg" , ng-click = "detachLimit(dataItem,limit_part)",style="margin-left:30%" height="30" width="30" alt="Submit">'
                },

                {
                    title: "Добавить",
                    hidden: hide,
                    template: '<input type="image" src="images/rfinger.jpg" , ng-click = "attachLimit(dataItem,limit_part)" style="margin-left:20%" height="30" width="30" alt="Submit">'
                }

            ]

        }
    }

    $scope.editGridOption = {

        dataSource: {

            type: "odata",

            data: [],

            group: {

                field: "owner.subjectId", aggregates: [{field: "owner.subjectId", aggregate: "min"}]
            }

        },

        change: onEditPanelChange,

        scrollable: false,

        sortable: true,

        resizable: true,

        navigatable: true,

        selectable:true,

        columns: [

            { field: "owner.subjectId",  hidden: true, groupHeaderTemplate:"{{groupName(#=value#)}}", title: "id_owner"},

            { field: "right_owner_id" ,title: "ID" },

            { title: "Вид права:" ,template:"{{edit_right.right_type_name}}"},

            { title: "Имя объекта:", template:"{{edit_right.bindedObj.object_name + '; '+edit_right.bindedObj.address}}"},

            { title: "Тип объекта:", template:"{{edit_right.bindedObj.objectType.code_name}}"},

            { field:"FIO", title: "Имя/название правообладателя:", template:"{{dataItem.owner.fullname === undefined?BeautyCast(dataItem.owner.surname,dataItem.owner.firstname,dataItem.owner.fathername):(dataItem.owner.fullname)}}"},

            { field:"Teils", title:"Доля в праве", footerTemplate:"Сумма = {{BeautySumm()}}",template: "#= numerator_part+''+(denominator_part == 1 ?'':'/'+denominator_part) #" }

        ]

    };

    $scope.mainGridOptions = {

        dataSource: { data:[]},

        scrollable: false,

        sortable: true,

        resizable: true,

        navigatable: true,

        filterable: {

            extra: false,

            operators: {

                string: {

                    startswith: "Starts with",
                    eq: "Is equal to",
                    neq: "Is not equal to"

                }

            }
        },

        columns: [

            {field: "bufer",  filterable: false, title: "Действия <br> с правом", template: '<input type="checkbox"  class="inputtd" ng-click="BufferChange(dataItem, $event)" ng-model="checked[mainGridOptions.curTabNum][dataItem.right_id]">'},

            {field: "right_id",  filterable: false, title: "ID"},

            {field: "right_type_name",  filterable: false, title: "Вид права:"},

            {field: "right_entity_type_name",  filterable: false, title: "<center>Объект операции  <br> (сущность)</center>"},

            {field: "right_count_type_name", filterable: false, title: "<center>Тип права по числу <br> правообладателей</center>"},

            {field: "begin_date",  filterable: false, title: "<center> Дата <br> возникновения права</center>", template:"#= begin_date!=null?kendo.toString(kendo.parseDate(new Date(begin_date)), 'dd-MM-yyyy'):'' #"},

            {field: "end_date",  filterable: false, title: "<center> Дата <br>прекращения права</center>", template:"#= end_date!=null?kendo.toString(kendo.parseDate(new Date(end_date)), 'dd-MM-yyyy'):'' #"},

            {field: "bindedObj.object_name",  title: "Имя объекта"} ,

            {title: "Тип объекта:", template: "#= bindedObj.objectType.code_name #" },

            {title: "", template: '<span class="btn btn-default" ng-hide="mainGridOptions.curTabNum==1" ng-click="OnDeleteClick(dataItem)">Удалить</span>'}

        ]

    };

    $scope.detailOwnersOptions = function(dataItem) { return {

        dataSource: { data: dataItem === undefined ? null : dataItem.rightOwners },

        scrollable: false,

        sortable: true,

        resizable: true,

        columns: [

            {title:"Имя/название правообладателя" ,template: "{{dataItem.owner.fullname === undefined? BeautyCast(dataItem.owner.surname,dataItem.owner.firstname,dataItem.owner.fathername):dataItem.owner.fullname}}" },

            {field:"owner.address", title:"Адресс правообладателя" },

            {title:"Тип субъекта", template: "#= data.owner.dtype=='private'?'физ. лицо':'юр. лицо'#" },

            {title:"Доля в праве", template: "#= data.numerator_part+''+(data.denominator_part == 1 ?'':'/'+data.denominator_part) #" },

            {field: "date_in", title: "Дата возникновения доли", template:"#= data.date_in!=null?kendo.toString(kendo.parseDate(new Date(data.date_in)), 'dd-MM-yyyy'):'' #"},

            {field: "date_out", title: "Дата прекращения доли", template:"#= data.date_out!=null?kendo.toString(kendo.parseDate(new Date(data.date_out)), 'dd-MM-yyyy'):'' #"}

        ]

    }; };

    //////////////////////////////////common window////////////////////////////////////////////////////////////////////

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.urlmodObj = WEBDOM + '//#/object';

    $scope.DlgOptions = {width: "1300px", height: "700px", modal: true, actions: [ "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.begin_date = new Date();

    $scope.end_date = '';

    $scope.tabNum = 1;

    $scope.limitHide = true; // признак обременения

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

        limitation: false,

        rightDetail:{},

        rightsDataSearch: [],

        rightsDataLimitFrom:[],

        rightsDataLimitTo:[]

    };

    $scope.dict = {

        rightEntityTypes : [],

        rightTypes : [],

        rightCountTypes : [],

        operTypes : [],

        operSubTypes : [],

        operBases : []

    };

    $scope.ErrorMessage = {

        1:"Объект уже существует",
        2:"Не указан объект",
        3:"Не указан вид права",
        4:"Не указан правообладатель",
        5:"Не указана дата действия права, либо доли",
        6:"Не указана доля",
        7:"Доля, либо сумма долей в праве больше еденицы (>1)",
        8:"Не указаны операции",
        9:"Не указан тип права по числу правообладателей",
        10:"Не указан объект (сущность) операции",
        11:"Сумма долей права больше 1 (>1)",
        12:"Необходимо создать право, либо долю в праве",
        13:"Право не создано, нельзя изменить",
        14:"Пивязанный к праву объект изменить нельзя",
        15:"Вид права изменить нельзя",
        16:"Тип права по числу правообладателей изменить нельзя",
        17:"Объект операции (сущность) изменить нельзя"

    }

    /////////////////////////////// Init block ///////////////////////////////////////////////////////////////////////

    $scope.init = function () {

        // $scope.var.loading = true;

        $scope.rightsDataSearchTabHide = true;

        // $scope.detailOwnersOptions.BeautyCast() = $scope.BeautyCast;

        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightCountType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightCountTypes = res.data;

            $scope.var.loading = false;

        });

        $scope.var.url = DOMAIN + "/nka_net3/catalog/rightEntityType";

        $http.get($scope.var.url).then(function (res) {

            $scope.dict.rightEntityTypes = res.data;

            $scope.var.loading = false;

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

        if($scope.emptyIfundefine($scope.sel_object[$scope.tabNum].obj_id) == '' && $scope.emptyIfundefine($scope.sel_subject[$scope.tabNum].subjectId) == '')
        { swal("Info", "Не выбран субъект, либо объект поиска" , "info"); return; }

        $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids="+ $scope.emptyIfundefine($scope.sel_object[$scope.tabNum].obj_id) + "&person_id=" + $scope.emptyIfundefine($scope.sel_subject[$scope.tabNum].subjectId);

       // $scope.urlSearch = DOMAIN + "/nka_net3/right/getRightObjectPerson?obj_ids=261&person_id=";

        $scope.var.loading = true;

        $http.get($scope.urlSearch).success(function (res) {

            $scope.var.loading = false;

            if (res.length == 0) { $scope.mainGridOptions.dataSource.data =[]; return };

            $scope.var.rightsDataSearch = res;

            $scope.rightsDataSearchTabHide=false;

            $scope.var.rightsDataSearch.forEach(function(value) {$scope.fillDictName(value); $scope.getAddress(value.bindedObj);});

            $scope.mainGridOptions.dataSource.data = $scope.var.rightsDataSearch;

            ////////////////////////////////////////////////////////////////////////////////


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

        $scope.limitHide = $scope.dict.currgtTyp.code_name.indexOf('Ограничения')>=0 ? false : true;

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


    };

    $scope.setOperFilter = function() {

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

        if(this.nullIfundefine(this.dict.curoprSubTyp) == null ){return;}

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

    /////////////////////////// Bufer and Limitation operation //////////////////////////////////////////////////////////////
    $scope.OnDeleteClick = function(rec){

        $scope.checked[$scope.tabNum][rec.right_id] = false;

        $scope.checked[$scope.tabNum-1][rec.right_id] = false;

        if ( rec.right_id == $scope.edit_right.right_id ) { $scope.edit_right = {}; }

        if ( rec.right_id == $scope.form_edit_right.right_id ) { $scope.CleanEditForm(); }

        var idx = $scope.sel_buffer.indexOf(rec);

        $scope.sel_buffer.splice(idx, 1);

    };

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

            } else {

                if ($scope.edit_right.right_id == rec.right_id ){

                    $scope.edit_right = {};

                    $scope.CleanEditForm();
                }

            }
        }

        if ($scope.tabNum == 2) {

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.edit_right = $scope.sel_buffer.find(function (value) { return value.right_id == this.curType;}, {curType: rec.right_id});

                $scope.editGridOption.dataSource.data = $scope.edit_right.rightOwners;

                /////////// заполняем только левую панель права ///////////

                $scope.CleanEditForm();

                $scope.form_edit_right = $scope.copyRightForm( $scope.edit_right );


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

    $scope.addToBuffer = function(rec){

        var idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curType;}, {curType: rec.right_id});

        idx != -1 ? $scope.sel_buffer.splice(idx, 1) : null;

        $scope.sel_buffer.push(rec);

        $scope.checked[$scope.tabNum][rec.right_id] = true;

        $scope.checked[$scope.tabNum-1][rec.right_id] = false;

        for (var item in $scope.checked[$scope.tabNum]  ) {

            if (item != rec.right_id) {

                $scope.checked[$scope.tabNum][item] = false;

                $scope.checked[$scope.tabNum-1][item] = false;

            }

        }


    };

    ///////////////////////////// Modal Window part ///////////////////////////////////////////////////////////

    $scope.LoadBuffer = function(){

        /////////////////////////// head rename ///////////////////////////

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

    $scope.displayLimitation = function(){

        $scope.DlgOptions.title = "Действия с ограничениями";

        $scope.limwindow.setOptions($scope.DlgOptions);

        $scope.limwindow.center();

        var modInst =  $scope.limwindow.open();

    };

    $scope.dispalyOperations = function(modid){

        if(!$scope.nullIfundefine($scope.dict.curoprSubTyp)){ $scope.dict.filterSubTypes = []; };

        if(!$scope.nullIfundefine($scope.dict.curoprBase)){ $scope.dict.filterBases = []; };

        $scope.dispalyModal(modid);



    }

    $scope.dispalyModal = function(modid) {

        var myElement = angular.element(document.querySelector(modid));

        myElement.modal("show");

    };

    /////////////////////////////// limitation operations /////////////////////////////////////////////////

    $scope.detachLimit = function(dataItem, limit_part){

        var upd_form = angular.copy(dataItem);

        $scope.var.rightsDataLimitTo = $scope.var.rightsDataLimitTo.filter(function(value){ return value.right_id != this.rightId},{rightId: dataItem.right_id});

        limit_part ? upd_form.limit_right = null : upd_form.rightOwners[0].parent_owner = null;

        upd_form.ooper.parent_id_order = null;

        upd_form = $scope.bringtoRight(upd_form);

        $scope.var.loading = true;

        $http.post(DOMAIN + "/nka_net3/right/updRight?", upd_form).success(function (data, status, headers) {

            $scope.var.loading = false;

            var idx = $scope.sel_buffer.findIndex(function (value) { return ( value.right_id == this.CurType ); }, {CurType: dataItem.right_id});

            dataItem = data;

            $scope.fillDictName(dataItem);

            if( idx != -1 ) { $scope.sel_buffer[idx] =  dataItem;}
            else { $scope.sel_buffer.push(dataItem); }

            $scope.var.rightsDataLimitFrom.push(dataItem);


        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            alert("Error " + data.message );

        });

    };

    $scope.attachLimit = function(dataItem, limit_part){

        var upd_form = angular.copy(dataItem);

        $scope.var.rightsDataLimitFrom = $scope.var.rightsDataLimitFrom.filter(function(value){ return value.right_id != this.rightId},{rightId: dataItem.right_id});

        limit_part ? upd_form.limit_right = $scope.form_edit_right.right_id : upd_form.rightOwners[0].parent_owner = $scope.form_edit_right.rightOwner.right_owner_id;

        upd_form.ooper.parent_id_order = $scope.form_edit_right.ooper.ooperId;

        upd_form = $scope.bringtoRight(upd_form);

        $scope.var.loading = true;

        $http.post(DOMAIN + "/nka_net3/right/updRight?", upd_form).success(function (data, status, headers) {

            $scope.var.loading = false;

            var idx = $scope.sel_buffer.findIndex(function (value) { return ( value.right_id == this.CurType ); }, {CurType: dataItem.right_id});

            dataItem = data;

            $scope.fillDictName(dataItem);

            if( idx != -1 ) { $scope.sel_buffer[idx] =  dataItem;}

            $scope.var.rightsDataLimitTo.push(dataItem);

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            alert("Error: " + data.message);

        });

    };

    $scope.operLimitationRight = function(){

        $scope.limit_part =true;

        $scope.var.rightsDataLimitFrom = [];

        $scope.var.rightsDataLimitTo = [];

        var cur_right_id = $scope.form_edit_right.right_id;

        if(cur_right_id == null ) {  swal("Error", "Не выбрано либо не создано право", "error"); return; }

            $scope.var.rightsDataLimitTo = [];

            $scope.var.url = DOMAIN + "/nka_net3/right/getLimitObject?right_id=" + cur_right_id + "&right_owner_id=";

            $http.get($scope.var.url).success(function (res) {

                $scope.form_edit_right.limit_rights = res;

                $scope.var.loading = false;

                $scope.var.rightsDataLimitTo = $scope.var.rightsDataLimitTo.concat($scope.form_edit_right.limit_rights);

                $scope.var.rightsDataLimitTo.forEach(function (value) {
                    $scope.fillDictName(value);
                    value.bindedObj = angular.copy($scope.form_edit_right.bindedObj);
                });

                $scope.var.rightsDataLimitFrom = $scope.sel_buffer.filter(function (value) {
                    return ( value.right_type_name.search(/Ограничения/i) >= 0 ) && (value.bindedObj.obj_id == this.curObj) && (value.limit_right == null) &&  (value.rightOwners[0].parent_owner == null)
                }, {curObj: $scope.form_edit_right.bindedObj.obj_id});

                $scope.var.rightsDataLimitFrom = $scope.var.rightsDataLimitFrom.filter(function (limFrom) {

                    return !(this.limTo.find(function (value) {
                        return ( value.right_id == this.CurType );
                    }, {CurType: limFrom.right_id}))

                }, {limTo: $scope.var.rightsDataLimitTo});

                $scope.displayLimitation();

            }).error(function (data, status, header, config) {

                $scope.var.loading = false;

                swal("Error", data.message, "error");

            });
        };

    $scope.operLimitationRightOwner = function(){

        $scope.limit_part = false;

        $scope.var.rightsDataLimitFrom = [];

        $scope.var.rightsDataLimitTo = [];

        var cur_right_own_id = $scope.form_edit_right.rightOwner.right_owner_id;

        if(cur_right_own_id == null ) {  swal("Error", "Не выбрано либо не создано доля в праве", "error"); return; }

        //if ($scope.nullIfundefine($scope.form_edit_right.rightOwner.limit_rights) == null) {
        //}
        //else { $scope.displayLimitation(); }

            $scope.var.url = DOMAIN + "/nka_net3/right/getLimitObject?right_id=" + "&right_owner_id="+cur_right_own_id;

            $http.get($scope.var.url).success(function (res) {

                $scope.form_edit_right.rightOwner.limit_rights = res;

                $scope.var.loading = false;

                $scope.var.rightsDataLimitTo = $scope.var.rightsDataLimitTo.concat($scope.form_edit_right.rightOwner.limit_rights);

                $scope.var.rightsDataLimitTo.forEach(function (value) {
                    $scope.fillDictName(value);
                    value.bindedObj = angular.copy($scope.form_edit_right.bindedObj);
                });

                $scope.var.rightsDataLimitFrom = $scope.sel_buffer.filter(function (value) {
                    return ( value.right_type_name.search(/Ограничения/i) >= 0 ) && (value.bindedObj.obj_id == this.curObj) && (value.rightOwners[0].parent_owner == null) && (value.limit_right == null)
                }, {curObj: $scope.form_edit_right.bindedObj.obj_id});

                $scope.var.rightsDataLimitFrom = $scope.var.rightsDataLimitFrom.filter(function (limFrom) {

                    return !(this.limTo.find(function (value) { return ( value.rightOwners[0].right_owner_id == this.CurType ); }, {CurType: limFrom.rightOwners[0].right_owner_id}))

                }, {limTo: $scope.var.rightsDataLimitTo});

                $scope.displayLimitation();

            }).error(function (data, status, header, config) {

                $scope.var.loading = false;

                swal("Error", data.message, "error");

            });

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

        if ($scope.CreateRightCheck($scope.form_edit_right)) {return;};

        crete_right_obj = $scope.preCreateRight();

        crete_right_obj = $scope.bringtoRight(crete_right_obj);

        $scope.var.loading = true;

        /////////////////////////////////////////////////////////////////////////////////////////////

        $http.post(DOMAIN + "/nka_net3/right/addRight?", crete_right_obj).success(function (data, status, headers) {

            $scope.var.loading = false;

            crete_right_obj = data;

            $scope.postCreateRight(crete_right_obj);

            $scope.refreshEditPanel();

            swal("Ок", "Право создано", "success");

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            swal("Error", data.message , "error");

        });


    }

    $scope.CreateOwnerPart = function() {

        var crete_right_owner = {};

        if ($scope.CreateRightOwnerCheck($scope.form_edit_right)) {return;};

        $scope.preCreateRightOwnerPart();

        $scope.copyRightOwner($scope.form_edit_right.rightOwner,crete_right_owner);

        var crete_right_owner = $scope.normRightOwner({rightOwners:[crete_right_owner]})[0];

        $scope.var.loading = true;

        $http.post(DOMAIN + "/nka_net3/right/addRightOwnerPart?", crete_right_owner).success(function (data, status, headers) {

            $scope.var.loading = false;

            crete_right_owner = data;

            $scope.postCreateRightOwnerPart(crete_right_owner);

            $scope.refreshEditPanel();

            swal("Ок", "Доля добавлена", "success");

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            swal("Error", data.message , "error");

        });
    }

    $scope.UpdateRight = function() {

        var upd_right_obj = {};

        if ($scope.UpdateRightCheck($scope.form_edit_right)) {return;};

        upd_right_obj = $scope.preUpdatePart();

        upd_right_obj = $scope.bringtoRight(upd_right_obj);

        $scope.var.loading = true;

        $http.post(DOMAIN + "/nka_net3/right/updRight?", upd_right_obj).success(function (data, status, headers) {

            $scope.var.loading = false;

            upd_right_obj = data;

            $scope.postUpdatePart(upd_right_obj);

            $scope.refreshEditPanel();

            swal("Ок", "Право обновлено", "success");

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            swal("Error", data.message , "error");

        });

    }

    ///////////// обработка объектов до и  после операций ///////////////////////////////////////////////////////

    $scope.postCreateRight = function(ret_val){


        $scope.form_edit_right.right_id = ret_val.right_id;

        $scope.edit_right.right_id = ret_val.right_id;

        $scope.edit_right.ooper = angular.copy(ret_val.ooper);

        $scope.fillDictName($scope.edit_right);

        $scope.sel_object[$scope.tabNum] = angular.copy(ret_val.bindedObj);

        if ( $scope.nullIfundefine(ret_val.rightOwners[0]) != null  ){

            $scope.sel_subject[$scope.tabNum] = ret_val.rightOwners[0].owner;

            $scope.edit_right.rightOwners[0].right_owner_id = ret_val.rightOwners[0].right_owner_id;

            $scope.edit_right.rightOwners[0].right_id = ret_val.rightOwners[0].right_id;

            $scope.edit_right.rightOwners[0].ooper = angular.copy(ret_val.rightOwners[0].ooper);

            $scope.edit_right.ooper = angular.copy(ret_val.ooper);

            $scope.edit_right.bindedObj.address = $scope.form_edit_right.bindedObj.address_dest.adr;

            $scope.form_edit_right.rightOwner = angular.copy(rightvar.rightOwner);//.right_owner_id = ret_val.rightOwners[0].right_owner_id;

            $scope.addToBuffer($scope.edit_right);

        }


    }

    $scope.preCreateRight = function() {

        var ret_obj = {};

        $scope.edit_right = angular.copy(rightvar);

        $scope.form_edit_right.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.status = 1;

        $scope.form_edit_right.rightOwner.date_in = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_in);

        $scope.form_edit_right.rightOwner.date_out = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_out);

        $scope.copyRight($scope.form_edit_right,$scope.edit_right);

        $scope.edit_right.right_count_type = $scope.form_edit_right.right_count_type =  $scope.nullIfundefine($scope.dict.currgtCountTyp)==null ? null : $scope.dict.currgtCountTyp.code_id;

        $scope.edit_right.right_entity_type = $scope.form_edit_right.right_entity_type = $scope.nullIfundefine($scope.dict.curentTyp)==null ? null : $scope.dict.curentTyp.code_id;

        $scope.edit_right.right_type = $scope.form_edit_right.right_type = $scope.nullIfundefine($scope.dict.currgtTyp)==null ? null : $scope.dict.currgtTyp.code_id;

        $scope.edit_right.rightOwners.push(angular.copy($scope.form_edit_right.rightOwner));

        ret_obj = angular.copy($scope.edit_right);

        return ret_obj;
    }

    $scope.preCreateRightOwnerPart = function() {

        $scope.form_edit_right.rightOwner.date_in = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_in);

        $scope.form_edit_right.rightOwner.date_out = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_out);

        $scope.form_edit_right.right_owner_id = null;

        $scope.form_edit_right.rightOwner.right_id = $scope.form_edit_right.right_id;

        $scope.form_edit_right.rightOwner.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.ooper.parent_id_order = $scope.form_edit_right.ooper.ooperId;

    }

    $scope.postCreateRightOwnerPart = function(ret_val){

        if ( $scope.nullIfundefine(ret_val) != null){

            ret_val.owner = $scope.sel_subject[$scope.tabNum];

            $scope.edit_right.rightOwners.push(ret_val);

            $scope.form_edit_right.rightOwner = angular.copy(rightvar.rightOwner);//.right_owner_id = ret_val.rightOwners[0].right_owner_id;

            $scope.edit_right.bindedObj.address = $scope.form_edit_right.bindedObj.address_dest.adr;

            $scope.addToBuffer($scope.edit_right);

        }

    }

    $scope.createOperObject = function(){

        $scope.oper_right = angular.copy(operationtvar);

        //$scope.oper_right.entytyType = $scope.nullIfundefine($scope.dict.curentTyp)==null ? null : $scope.dict.curentTyp.code_id;

        $scope.oper_right.operType = $scope.nullIfundefine($scope.dict.curoprTyp)==null ? null : $scope.dict.curoprTyp.code_id;

        $scope.oper_right.operSubtype = $scope.nullIfundefine($scope.dict.curoprSubTyp)==null ? null : $scope.dict.curoprSubTyp.code_id;

        $scope.oper_right.reason = $scope.nullIfundefine($scope.dict.curoprBase)==null ? null : $scope.dict.curoprBase.code_id;

        $scope.oper_right.regDate = new Date();

        $scope.oper_right.operDate = new Date();

        $scope.oper_right.status = 1;

        return $scope.oper_right;

    }

    $scope.preUpdatePart = function() {

        var var_to_upd = angular.copy($scope.edit_right);

        $scope.form_edit_right.rightOwner.date_in = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_in);

        $scope.form_edit_right.rightOwner.date_out = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_out);

        ///////////////////////  страховка от лишних апдейтов, вызванных неизменными операциями/////////////////////////////////////////////////////////////////////
        var new_ooper = $scope.createOperObject();

        var old_ooper = $scope.form_edit_right.rightOwner.ooper;

        $scope.form_edit_right.rightOwner.ooper.operType = new_ooper.operType;

        $scope.form_edit_right.rightOwner.ooper.operSubtype = new_ooper.operSubtype;

        $scope.form_edit_right.rightOwner.ooper.reason =  new_ooper.reason;

        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        $scope.copyRight($scope.form_edit_right, var_to_upd);

        var idx = var_to_upd.rightOwners.findIndex(function (value) {return value.right_owner_id == this.curOwnerId;}, {curOwnerId:  $scope.form_edit_right.rightOwner.right_owner_id});

        $scope.copyRightOwner($scope.form_edit_right.rightOwner, var_to_upd.rightOwners[idx]);

        return var_to_upd;

    };

    $scope.postUpdatePart = function(ret_val) {

        var ret_val_idx = ret_val.rightOwners.findIndex(function (value) {return value.right_owner_id == this.curOwnerId;}, {curOwnerId: $scope.form_edit_right.rightOwner.right_owner_id});

        var r_own_idx = $scope.edit_right.rightOwners.findIndex(function (value) {return value.right_owner_id == this.curOwnerId;}, {curOwnerId:  $scope.form_edit_right.rightOwner.right_owner_id});

        var buf_idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curId;}, {curId: $scope.form_edit_right.right_id});

        ret_val.bindedObj = $scope.sel_object[$scope.tabNum];

        $scope.form_edit_right = $scope.copyRightForm(ret_val);

        $scope.copyRight($scope.form_edit_right, $scope.edit_right);

        $scope.copyRight($scope.edit_right, $scope.sel_buffer[buf_idx]);

        $scope.fillDictName($scope.edit_right);

        $scope.form_edit_right.rightOwner = $scope.copyRightOwnerForm(ret_val.rightOwners[ret_val_idx]);

        $scope.copyRightOwner($scope.form_edit_right.rightOwner, $scope.edit_right.rightOwners[r_own_idx]);

        $scope.copyRightOwner($scope.edit_right.rightOwners[r_own_idx], $scope.sel_buffer[buf_idx].rightOwners[r_own_idx]);

    };

    ///////////////////////////// Checks part /////////////////////////////////////////////////////////////////

    $scope.CreateRightCheck = function(to_check_right) {

        var ret_val = false;

        if($scope.nullIfundefine(to_check_right.right_id) != null) {

            swal("Error", $scope.ErrorMessage[1] , "error");

            ret_val = true;

        } else if($scope.nullIfundefine(to_check_right.bindedObj.obj_id) == null) {

            swal("Error", $scope.ErrorMessage[2] , "error");

            ret_val = true;

        } else if ($scope.nullIfundefine($scope.dict.currgtTyp) == null) {

            swal("Error", $scope.ErrorMessage[3] , "error");

            ret_val = true;

        } else if ($scope.nullIfundefine($scope.dict.currgtCountTyp) == null) {

            swal("Error", $scope.ErrorMessage[9] , "error");

            ret_val = true;

        }else if ($scope.nullIfundefine(to_check_right.rightOwner.owner.subjectId) == null) {

            swal("Error", $scope.ErrorMessage[4] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine(to_check_right.begin_date)==null || $scope.nullIfundefine(to_check_right.rightOwner.date_in)==null ) {

            swal("Error", $scope.ErrorMessage[5] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine(to_check_right.rightOwner.numerator_part) == null || $scope.nullIfundefine(to_check_right.rightOwner.denominator_part) == null ) {

            swal("Error", $scope.ErrorMessage[6] , "error");

            ret_val = true;

        }else if( Math.ceil(to_check_right.rightOwner.numerator_part/to_check_right.rightOwner.denominator_part) >1 ) {

            swal("Error", $scope.ErrorMessage[7] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine($scope.dict.curoprTyp) == null || $scope.nullIfundefine($scope.dict.curoprTyp.code_id) == null) {

            swal("Error", $scope.ErrorMessage[8] , "error");

            ret_val = true;

        }

        return ret_val;
    }

    $scope.CreateRightOwnerCheck = function(to_check_right) {

        var ret_val = false;

        var fracion_check = new Fraction(to_check_right.rightOwner.numerator_part, to_check_right.rightOwner.denominator_part);

        if($scope.nullIfundefine(to_check_right.bindedObj.obj_id) == null) {

            swal("Error", $scope.ErrorMessage[2] , "error");

            ret_val = true;

        } else if ($scope.nullIfundefine($scope.dict.currgtTyp) == null) {

            swal("Error", $scope.ErrorMessage[3] , "error");

            ret_val = true;

        } else if ($scope.nullIfundefine($scope.dict.currgtCountTyp) == null) {

            swal("Error", $scope.ErrorMessage[9] , "error");

            ret_val = true;

        }else if ($scope.nullIfundefine(to_check_right.rightOwner.owner.subjectId) == null) {

            swal("Error", $scope.ErrorMessage[4] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine(to_check_right.begin_date)==null || $scope.nullIfundefine(to_check_right.rightOwner.date_in)==null ) {

            swal("Error", $scope.ErrorMessage[5] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine(to_check_right.rightOwner.numerator_part) == null || $scope.nullIfundefine(to_check_right.rightOwner.denominator_part) == null ) {

            swal("Error", $scope.ErrorMessage[6] , "error");

            ret_val = true;

        }else if( Math.ceil(to_check_right.rightOwner.numerator_part/to_check_right.rightOwner.denominator_part) >1 ) {

            swal("Error", $scope.ErrorMessage[7] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine($scope.dict.curoprTyp) == null || $scope.nullIfundefine($scope.dict.curoprTyp.code_id) == null ) {

            swal("Error", $scope.ErrorMessage[8] , "error");

            ret_val = true;

        }else if($scope.summRightOwnersPart($scope.edit_right.rightOwners).add(fracion_check) >1) {

            swal("Error", $scope.ErrorMessage[11] , "error");

            ret_val = true;

        }

        return ret_val;
    }

    $scope.UpdateRightCheck = function(to_check_right) {

        var ret_val = false;

        var fracion_check = new Fraction(to_check_right.rightOwner.numerator_part,to_check_right.rightOwner.denominator_part);

        if(this.nullIfundefine(to_check_right.rightOwner.right_owner_id) != null) {

            var replaced_owner = $scope.edit_right.rightOwners.find(function (value) {return value.right_owner_id == this.rownId;}, {rownId: to_check_right.rightOwner.right_owner_id});

            var fracion_check = new Fraction(to_check_right.rightOwner.numerator_part, to_check_right.rightOwner.denominator_part).sub(new Fraction(replaced_owner.numerator_part, replaced_owner.denominator_part));

        }
        else {
            swal("Error", $scope.ErrorMessage[12] , "error");

            ret_val = true;
        }

        if( ($scope.nullIfundefine(to_check_right.rightOwner.right_owner_id) == null) || ($scope.nullIfundefine(to_check_right.right_id) == null) ) {

            swal("Error", $scope.ErrorMessage[12] , "error");

            ret_val = true;

        } else if($scope.nullIfundefine(to_check_right.bindedObj.obj_id) == null) {

            swal("Error", $scope.ErrorMessage[2] , "error");

            ret_val = true;

        } else if ($scope.nullIfundefine($scope.dict.currgtTyp) == null) {

            swal("Error", $scope.ErrorMessage[3] , "error");

            ret_val = true;

        } else if ($scope.nullIfundefine($scope.dict.currgtCountTyp) == null) {

            swal("Error", $scope.ErrorMessage[9] , "error");

            ret_val = true;

        }else if ($scope.nullIfundefine(to_check_right.rightOwner.owner.subjectId) == null) {

            swal("Error", $scope.ErrorMessage[4] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine(to_check_right.begin_date)==null || $scope.nullIfundefine(to_check_right.rightOwner.date_in)==null ) {

            swal("Error", $scope.ErrorMessage[5] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine(to_check_right.rightOwner.numerator_part) == null || $scope.nullIfundefine(to_check_right.rightOwner.denominator_part) == null ) {

            swal("Error", $scope.ErrorMessage[6] , "error");

            ret_val = true;

        }else if( Math.ceil(to_check_right.rightOwner.numerator_part/to_check_right.rightOwner.denominator_part) >1 ) {

            swal("Error", $scope.ErrorMessage[7] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine($scope.dict.curoprTyp) == null ) {

            swal("Error", $scope.ErrorMessage[8] , "error");

            ret_val = true;

        }else if($scope.summRightOwnersPart($scope.edit_right.rightOwners).add(fracion_check) >1) {

            swal("Error", $scope.ErrorMessage[11] , "error");

            ret_val = true;

        }else if(to_check_right.bindedObj.obj_id != $scope.edit_right.bindedObj.obj_id){

            swal("Error", $scope.ErrorMessage[14] , "error");

            ret_val = true;

        }else if($scope.dict.currgtTyp.code_id != $scope.edit_right.right_type)
        {
            swal("Error", $scope.ErrorMessage[15] , "error");

            ret_val = true;

        }else if($scope.dict.currgtCountTyp.code_id != $scope.edit_right.right_count_type)
        {
            swal("Error", $scope.ErrorMessage[16] , "error");

            ret_val = true;

        }else if( $scope.nullIfundefine($scope.dict.curentTyp) != null &&  $scope.nullIfundefine($scope.dict.curentTyp.code_id) !=  $scope.nullIfundefine($scope.edit_right.right_entity_type))
        {
            swal("Error", $scope.ErrorMessage[17] , "error");

            ret_val = true;

        }

        return ret_val;
    }

    $scope.summRightOwnersPart = function(rOwners){

        var summ = new Fraction(0);

        for(rOwner in rOwners){

            summ = summ.add(new Fraction(rOwners[rOwner].numerator_part, rOwners[rOwner].denominator_part));

        }

        return summ;

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

        // if ($scope.tabNum == 1) { $scope.ChgKendoGridTitle("Действия <br> с правом");}

        // if ($scope.tabNum == 2) { $scope.ChgKendoGridTitle("Редактировать"); }


    };

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    ////////////////////////  для приведения в хороший json формат ////////////////////////////////////////////

    $scope.bringtoRight = function(item){

        delete item['rightOwner'];

        delete item['right_count_type_name'];

        delete item['right_entity_type_name'];

        delete item['right_type_name'];

        delete item['parent_owner_obj'];

        delete item['limit_rights'];

        delete item.bindedObj['fullname'];

        delete item.bindedObj['address'];

        item["rightOwners"] = $scope.normRightOwner(item);

        return item ;

    }

    $scope.normRightOwner = function(edit_right_val) {

        var norm_right_own = angular.copy(edit_right_val.rightOwners);

        if ($scope.nullIfundefine(norm_right_own.length) == null) {return;}

        for ( var item = 0 ; item < norm_right_own.length; item ++) {

            var right_owner = angular.copy(norm_right_own[item]);

            delete norm_right_own[item]['parent_owner_obj'];

            delete norm_right_own[item]['limit_rights'];

            delete norm_right_own[item]['owner'];

            norm_right_own[item]['owner'] = {subjectId:right_owner.owner.subjectId};

        }

        return norm_right_own;
    }

    ////////////////////// копирование права на объект и на форму ///////////////////////

    $scope.copyRightForm = function(var_from){

        var var_to = angular.copy(rightvar);

        $scope.copyRight(var_from, var_to)

        $scope.dict.currgtTyp = $scope.dict.rightTypes.find(this.initType ,{curType:$scope.edit_right.right_type});

        $scope.setRightType();

        $scope.sel_object[$scope.tabNum] = angular.copy($scope.edit_right.bindedObj);

        return var_to;

    }

    $scope.copyRight = function(var_from, var_to){

        //////////////////////////////другие поля ////////////////////////////////////////

        var_to.begin_date = new Date(var_from.begin_date);

        var_to.end_date = this.nullIfundefine(var_from.end_date) == null? null: new Date(var_from.end_date);

        var_to.bindedObj = angular.copy(var_from.bindedObj);

        var_to.ooper =  angular.copy(var_from.ooper);

        var_to.bindedObj.fullname = var_from.bindedObj.object_name + '; '+var_from.bindedObj.address ;

        var_to.is_needed =  var_from.is_needed;

        var_to.comments = var_from.comments;

        var_to.right_type = var_from.right_type;

        var_to.right_type_name = var_from.right_type_name;

        var_to.right_count_type = var_from.right_count_type;

        var_to.right_count_type_name = var_from.right_count_type_name;

        var_to.right_entity_type = var_from.right_entity_type;

        var_to.right_entity_type_name =var_from.right_entity_type_name;

        var_to.right_id = var_from.right_id;


    }

    $scope.copyRightOwner = function(var_from, var_to){

        var_to.owner = angular.copy(var_from.owner);

        var_to.ooper =  angular.copy(var_from.ooper);

        var_to.numerator_part = var_from.numerator_part;

        var_to.denominator_part = var_from.denominator_part;

        var_to.status = var_from.status;

        var_to.parent_owner = var_from.parent_owner;

        var_to.date_in = new Date(var_from.date_in);

        var_to.date_out = this.nullIfundefine(var_from.date_out) == null? null: new Date(var_from.date_out);

        var_to.right_id = var_from.right_id;

    }

    $scope.copyRightOwnerForm = function(var_from){

        var var_to = angular.copy(rightvar);

        $scope.copyRightOwner(var_from,var_to);

        $scope.sel_subject[$scope.tabNum] = angular.copy(var_from.owner);

        var_to = angular.copy(var_from);

        if ($scope.sel_subject[$scope.tabNum].dtype == "private") {

            var_to.owner.fullname = $scope.sel_subject[$scope.tabNum].surname + ' ' + $scope.sel_subject[$scope.tabNum].firstname + ' ' + $scope.sel_subject[$scope.tabNum].fathername ;

            var_to.owner.fullname = var_to.owner.fullname.replace(/null/g,'');

        }

        var_to.date_in = new Date(var_from.date_in);

        var_to.date_out = this.nullIfundefine(var_from.date_out) == null? null: new Date(var_from.date_out);

        $scope.fillOper(var_to);

        return var_to;

    }

    //////////////////////////////////////////////// служебные функции ////////////////////////////////////////////

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

        return obj === undefined ? null : obj;

    };

    $scope.emptyIfundefine = function(obj){

        return obj === undefined ? '' : obj;

    };

    $scope.timetoUTC = function(obj_date) {

        var ret_date = null;

        if (this.nullIfundefine(obj_date) == null) {return null;}

        var sub_date = new Date(obj_date);

        ret_date = Date.UTC( sub_date.getFullYear(), sub_date.getMonth() , sub_date.getDate());

        return obj_date;

    };

    $scope.BeautyCast = function(var_one, var_two, var_three) {

        return (var_one + ' ' + var_two +' '+ var_three).replace(/null/g,'').trim();

    };

    $scope.ChgKendoGridTitle = function(name) {

        var kendoObj = $("#kg").data("kendoGrid");

        $scope.mainGridOptions.columns[0].title = name;

        if ($scope.nullIfundefine(kendoObj) != null){

            kendoObj.dataSource.read();

            kendoObj.refresh();
        }

    }

    $scope.ChgEntity = function(){

        $scope.pr_class = $scope.obj_class;

        $scope.obj_class = $scope.sbj_class;

        $scope.sbj_class = $scope.pr_class;

        $scope.CleanForm();

    };

    $scope.BeautySumm = function(){

        var summ = $scope.summRightOwnersPart($scope.edit_right.rightOwners);

        return summ.n+ "/" + summ.d;

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

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function onEditPanelChange(e){

        var selectedRow = this.select();

        $scope.editGridOption.selectedDataItem = {}

        $scope.editGridOption.selectedDataItem = this.dataItem(selectedRow);

        $scope.form_edit_right = $scope.copyRightForm($scope.edit_right);

        $scope.form_edit_right.rightOwner = $scope.copyRightOwnerForm($scope.editGridOption.selectedDataItem);

        $scope.refreshEditPanel();

    }

    $scope.refreshEditPanel = function(){

        $scope.editGridOption.dataSource.data = $scope.edit_right.rightOwners;

    }

    /////////////////////////////////////////new part/////////////////////////////////////////////////////////////

    $scope.groupName = function(row_id) {

        var dataItems = $scope.editGridOption.dataSource.data.filter(function (value) {return value.owner.subjectId == this.curType;}, {curType: row_id});

        var summ = $scope.summRightOwnersPart(dataItems);

        var dataItem = dataItems[0];

        var ret_val = dataItem.owner.fullname === undefined?$scope.BeautyCast(dataItem.owner.surname,dataItem.owner.firstname,dataItem.owner.fathername):dataItem.owner.fullname ;

        ret_val = ret_val+ " ( Сумма доли = "+(summ.n+ "/" + summ.d) +" )";

        return ret_val;
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////



});


