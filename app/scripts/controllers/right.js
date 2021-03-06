/**
 * Created by beresnev on 06.11.2015.
 */


angular.module('assetsApp').controller('RightCtrl', function ($scope, $http, $timeout ,DOMAIN, WEBDOM, rightvar, operationtvar) {

    kendo.culture("ru-RU");

    $scope.transfer_img_left = "images/dfinger.jpg";

    $scope.transfer_img_right = "images/dfinger.jpg";

    $scope.anonymous = {
        "subjectId":1,"reestrdataID":1,"isOwner":1,"subjectType":110,
        "dtype":"private", "subjectdataid":1, "firstname":null,
        "surname":"аноним", "fathername":null, "sitizens":112,
        "bothRegDate":"1900-01-01T00:00:00.000Z","personalNumber":"АААААААААААААА",
        "address":null,"remark":null};

    $scope.mixMap = {Id: null, fromTeils:{n: null, d: null}, fromFIO:null, fromRoid:null, transTeils:{n: null, d: null}, toRoid:null, toFIO:null, toTeils:{n: null, d: null} };

    ///////////////////////////////kendo grid property/////////////////////////////////////////////////////////////////

    $scope.mixGridOption = function(data) {

        return {

            dataSource: {data: data,

                schema: {

                    model: {

                        fields: {

                            "fromTeils": {  editable: false },

                            "fromFIO": { type: "string", editable: false },

                            "fromRoid":{ type: "number", editable: false },

                            "transTeils.n" : { type: "number", editable: true },

                            "transTeils.d" : { type: "number", editable: true },

                            "toTeils": {  editable: false },

                            "toFIO": { type: "string", editable: false },

                            "toRoid":{ type: "number", editable: false }

                        }
                    }
                }
            },

            scrollable: false,

            sortable: false,

            resizable: true,

            navigatable: true,

            groupable: true,

            editable: true,

            selectable: false,

            messages : {
                commands: {
                    save: "Сохранить"
                }
            },

            groupable : {
                messages: {
                    empty : "Перетяните сюда заголовок колонки правообладателя"
                }
            },

            headerAttributes: {
                style: "text-align: center;"
            },

            saveChanges: function(e) { $scope.saveTransChange(e); },

            toolbar: ["save", {template:kendo.template("<input type='button' value='Проверить и показать итог'  ng-click='showTransCheck()' class='k-button'/>") }  ],

            columns: [

                { title: "Удалить", groupable:"false" ,attributes: { style: "background-color: white" }, template: '<input type="image" src="images/deletion.jpg" , ng-click = "detachTrans(dataItem.Id,\'FROM\')",style="margin-left:30%" height="30" width="30" alt="Submit">'},

                { field:"fromTeils", groupable:"false",title:"Доля", template:'<p>{{BeautyFraction(dataItem.fromTeils.n,dataItem.fromTeils.d)}}</p>'},

                { field:"fromFIO",title:"Имя/название правообладателя", headerTemplate:'<p align="center">Имя/название<br>правообладателя</p>'},

                { field: "fromRoid", title: "From Id" },

                {
                    title: "<center>Переходящая<br>доля</center>",

                    columns:[

                        { groupable:"false",attributes: { style: "background-color:rgba(227, 223, 231, 0.70)" }, title:"<span style='padding-left:40px;'> </span>", template:'<input type="number" ng-change = "transTeilsChange(dataItem)" ng-model = "dataItem.transTeils.n" style="width:40px"/>' },

                        { title:" ", groupable:"false" ,template: ' <img src="images/FS.png" height="40" width="40"/>'},

                        { groupable:"false" ,attributes: { style: "background-color:rgba(227, 223, 231, 0.70)" }, title: "<span style='padding-left:40px;'> </span>", template:'<input type="number" ng-change = "transTeilsChange(dataItem)" ng-model = "dataItem.transTeils.d" style="width:50px"/>'}

                    ]
                } ,

                { field: "toRoid", title: "To Id"},

                { field:"toFIO", title:"Имя/название правообладателя", headerTemplate:'<p align="center">Имя/название<br>правообладателя</p>'},

                { field:"toTeils", groupable:"false", title:"Доля",  template:'<p>{{BeautyFraction(dataItem.toTeils.n,dataItem.toTeils.d)}}</p>' },

                { title: "Удалить", groupable:"false", template: '<input type="image" style="background-color:white" src="images/deletion.jpg" , ng-click = "detachTrans(dataItem.Id,\'TO\')", style="margin-left:30%" height="30" width="30" alt="Submit">'},

                {title: " ", groupable:"false", template:'<button class="astext" ng-click="transGruntOpen(dataItem)">Основание</button>'},

                {title: " ", groupable:"false", template:'<button class="astext" ng-click="transDocs(dataItem)">Документы</button>'}


            ]

        };

    }

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

                {field: "right_entity_type_name", title: "<center>Объект операции  <br> (сущность)</center>"},

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

            {field: "right_type_name",  filterable: false, title: "Вид"},

            {field: "right_entity_type_name",  filterable: false, title: "<center>Объект операции  <br> (сущность)</center>"},

            {field: "right_count_type_name", filterable: false, title: "<center>Тип права по числу <br> правообладателей</center>"},

            {field: "begin_date",  filterable: false, title: "<center> Дата <br> возникновения</center>", template:"#= begin_date!=null?kendo.toString(kendo.parseDate(new Date(begin_date)), 'dd-MM-yyyy'):'' #"},

            {field: "end_date",  filterable: false, title: "<center> Дата <br>прекращения</center>", template:"#= end_date!=null?kendo.toString(kendo.parseDate(new Date(end_date)), 'dd-MM-yyyy'):'' #"},

            {field: "bindedObj.object_name",  title: "Имя объекта"} ,

            {title: "Тип объекта:", template: "#= bindedObj.objectType.code_name #" },

            {title: "", template: '<span class="btn btn-default" ng-hide="mainGridOptions.curTabNum==1" ng-click="OnDeleteClick(dataItem)">Удалить</span>'}

        ]

    };

    $scope.errNotifications  = function(data) {

        return {

            dataSource: {

                data: data,

                group: {

                    field: "ID"
                }

            },

            scrollable: false,

            sortable: true,

            resizable: true,

            columns: [

                {field: "ID", title: "ID"},

                {field: "errorMessage", title: "Текст Ошибки", attributes:{style:"color:red"} }

            ]

        }

    };

    $scope.detailOwnersOptions = function(dataItem) { return {

        dataSource: { data: dataItem },

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

    $scope.uploadOption = {

        async: {

            saveUrl: DOMAIN + "/nka_net3/doc/uploadDocument",

            autoUpload: true

        },

        multiple: false,

        select: function(e) {

            e.data = {};

            e.data["file"] = e.files[0];

            e.data["doc_desc"] = JSON.stringify({
                doc_id: "test",
                entity_id: 5,
                doc_type:124,
                document_number:789,
                document_date: new Date(),
                discription_org: "NCI",
                organisation: "NCI",
                description_doc: "my_docum",
                num:156
            });

    }

}
    //////////////////////////////////common window////////////////////////////////////////////////////////////////////

    $scope.urlmodSbj = WEBDOM + '//#/subject/true';

    $scope.urlmodObj = WEBDOM + '//#/object';

    $scope.DlgOptions = {width: "1300px", height: "700px", modal: true, actions: [ "Minimize", "Maximize", "Close"], iframe: true, visible: false };

    $scope.begin_date = new Date();

    $scope.end_date = '';

    $scope.tabNum = 1;  ////// 1 --- поиск, 2 --- редактор, 3 --- переход

    $scope.limitHide = true; // признак обременения

    $scope.tabClasses = ["","","","",""];

    $scope.sel_subject = [];              ///// субъект поиска, а так же субъект на форме

    $scope.sel_object = [];               ///// объект поиска, а так же объект на форме

    $scope.sel_buffer = [];               ///// данные буфера

    $scope.edit_right = {};               ///// право объекта редактирования

    $scope.form_edit_right = angular.copy(rightvar);    ///// право редактирования формы

    $scope.oper_right = angular.copy(operationtvar);    /////операции формы

    $scope.notifOption = { autoHideAfter: 1000 };

    $scope.checked=Create2DArray(5);

    $scope.file_to_upload = {};


    $scope.var = {

        loading: false,

        limitation: false,

        rightDetail:{},

        rightsDataSearch: [],

        rightsDataLimitFrom:[],

        rightsDataLimitTo:[],

        rightTransform:angular.copy(rightvar),

        ///////////////////////////////////////////////////

        mixTransformMap: [],

        rightTransformCh:{},

        rightsOwnersTransformTo:[],

        rightsOwnersTransformFrom:[],

        ///////////////////////////////////////////////////

        transformActive:"",

        ErrorNotific:[] // { errorMessage:"", Name (ID):"" };

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
        17:"Объект операции (сущность) изменить нельзя",
        18:"Cумма передаваемой доли превышает долю отправителя",
        19:"Сумма передаваемой доли превышает долю получателя",
        20:"Передаваемая доля имеет пустой, либо отрицательный числитель",
        21:"Передаваемая доля имеет пустой (=0), либо отрицательный знаменатель",
        22:"В строке не указано, от кого передается право",
        23:"Выбранное право является принимаемым",
        24:"Выбранное право является переходящим",
        25:"Нельзя передавать права между разными объектами",
        26:"Отсутствуют правообладатели с нулевой долей",
        27:"Ограничения обременение передавать нельзя",
        28:"В строке не указано, кому передается право",
        29:"Не указаны основания перехода",
        30:"Нельзя передать право к которому привязано ограничение",
        31:"Не выбрано либо не создано право",
        32:"Не выбрана либо не создана доля в праве",
        33:"Не выбран субъект, либо объект поиска"

    };


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
        { swal("Info", $scope.ErrorMessage[33] , "info"); return; }

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

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            swal("Error", data.message , "error");

        });

        ///////////////////////////////////////////////////////////////////////////////////

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
    $scope.setRightType = function(){

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

    $scope.setRightFilterType = function(){

        $scope.var.url = DOMAIN + "/nka_net3/catalog/childCodeAndType?id=" + this.nullIfundefine($scope.sel_object[2].objectType.code_id)+ "&childType=2" + "&parentType=20";

        $http.get($scope.var.url).then(function (res) {

            var subType = res.data;

            $scope.dict.rightFilterTypes = $scope.dict.rightTypes.filter($scope.filterType ,{curType:subType});

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

                $scope.setRightFilterType();

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

        if($scope.tabNum == 2){

            $scope.form_edit_right.rightOwner.owner = angular.copy($scope.sel_subject[2]);

            $scope.form_edit_right.rightOwner.owner.fullname = $scope.BeautyCast($scope.nullIfundefine($scope.form_edit_right.rightOwner.owner.fullname),'','');
        }


    };

    /////////////////////////// Bufer and Limitation operation ////////////////////////////////////////////////

    $scope.OnDeleteClick = function(rec){

        $scope.checked[1][rec.right_id] = false;

        $scope.checked[2][rec.right_id] = false;

        $scope.checked[3][rec.right_id] = false;

        if ( rec.right_id == $scope.edit_right.right_id ) { $scope.edit_right = {}; }

        if ( rec.right_id == $scope.form_edit_right.right_id ) { $scope.CleanEditForm(); }

        if ( rec.right_id == $scope.var.rightTransform.right_id ) { $scope.CleanTransForm(); }

        var idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curId;}, {curId: rec.right_id});

        $scope.sel_buffer.splice(idx, 1);

    };

    $scope.BufferChange = function(rec, e){

        if ($scope.tabNum == 1) {

            $scope.checked[$scope.tabNum+1][rec.right_id] = false;

            $scope.checked[$scope.tabNum+2][rec.right_id] = false;

            var item = $scope.var.rightsDataSearch.find(function (value) {return value.right_id == this.curType;}, {curType: rec.right_id});

            var idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curType;}, {curType: rec.right_id});

            idx != -1 ? $scope.sel_buffer.splice(idx, 1) : null;

            /// очистка если выбираем тот же в случае редактирования
            if(item.right_id == $scope.form_edit_right.right_id ) {

                $scope.CleanEditForm();

                $scope.edit_right = {} ;
            }

            if(item.right_id == $scope.var.rightTransform.right_id ) { $scope.CleanTransForm(); }

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.sel_buffer.push(item);

            }  else {

                if ($scope.edit_right.right_id == rec.right_id ){

                    $scope.edit_right = {};

                    $scope.CleanEditForm();

                }

                if(item.right_id == $scope.var.rightTransform.right_id ) {

                    $scope.CleanTransForm();

                }

            }
        }

        if ($scope.tabNum == 2) {

            if ($scope.checked[$scope.tabNum][rec.right_id]) {

                $scope.CleanEditForm();

                $scope.edit_right = $scope.sel_buffer.find(function (value) { return value.right_id == this.curType;}, {curType: rec.right_id});

                $scope.editGridOption.dataSource.data = $scope.edit_right.rightOwners;

                /////////// заполняем только левую панель права ///////////

                $scope.form_edit_right = $scope.copyRightForm( $scope.edit_right );

                /////////// копируем операции в случае ограничений и обременений //////

                if(!$scope.limitHide) {$scope.copyOperLimitonForm();};


            } else {

                $scope.edit_right = {};

                $scope.CleanEditForm();

            }

            for (var item in $scope.checked[$scope.tabNum]  ) {

                if (item != rec.right_id) { $scope.checked[$scope.tabNum][item] = false;}

            }

        }

        if ($scope.tabNum == 3) {

            var scip_right_id = null;

            var was_checked = $scope.checked[$scope.tabNum][rec.right_id];

            var right_to_trans = $scope.sel_buffer.find(function (value) {return value.right_id == this.curType; }, {curType: rec.right_id});

            $scope.CleanOperForm();

            if (right_to_trans.right_type_name.indexOf('Ограничения') >=0 ){

                $scope.checked[$scope.tabNum][rec.right_id] = false;

                $scope.notif.show($scope.ErrorMessage[27], "error");

                return;

            }

            var trans_to = right_to_trans.rightOwners.filter(function (value){return value.numerator_part == 0; });

            if( !trans_to.length ) {

                $scope.checked[$scope.tabNum][rec.right_id] = false;

                $scope.notif.show($scope.ErrorMessage[26], "error");

                return;

            }

            $scope.var.rightsOwnersTransformFrom = right_to_trans.rightOwners.filter(function (value){return value.numerator_part != 0; });

            $scope.var.rightsOwnersTransformTo = angular.copy(trans_to);

            if (was_checked) {

                $scope.checked[$scope.tabNum][$scope.var.rightTransform.right_id] = false;

                $scope.var.rightTransform = angular.copy(right_to_trans);

            } else {  $scope.CleanTransForm(); }

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

    ///////////////////////////// Modal Window part head rename ///////////////////////////


    $scope.LoadBuffer = function(){

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

    };

    $scope.dispalyModal = function(modid) {

        var myElement = angular.element(document.querySelector(modid));

        myElement.modal("show");

    };

    /////////////////////////////// Limitation operations /////////////////////////////////////////////////

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

            if( idx != -1 ) { $scope.sel_buffer[idx] =  dataItem;} else { $scope.sel_buffer.push(dataItem); }

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

        $scope.limit_part = true;

        $scope.var.rightsDataLimitFrom = [];

        $scope.var.rightsDataLimitTo = [];

        var cur_right_id = $scope.form_edit_right.right_id;

        if(cur_right_id == null ) {    swal("Error",$scope.ErrorMessage[31], "error"); return; }

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

        if(cur_right_own_id == null ) {  swal("Error", $scope.ErrorMessage[32], "error"); return; }

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

    ///////////////////////////// Operation part //////////////////////////////////////////////////////////

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


    };

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
    };

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

    };

    ///////////// обработка объектов до и  после операций //////////////////////////////////////////////////

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


    };

    $scope.preCreateRight = function() {

        var ret_obj = {};

        $scope.edit_right = angular.copy(rightvar);

        $scope.form_edit_right.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.status = 1;

        $scope.form_edit_right.begin_date = $scope.timetoUTC($scope.form_edit_right.begin_date);

        $scope.form_edit_right.end_date = $scope.timetoUTC($scope.form_edit_right.end_date);

        $scope.form_edit_right.rightOwner.date_in = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_in);

        $scope.form_edit_right.rightOwner.date_out = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_out);

        $scope.copyRight($scope.form_edit_right,$scope.edit_right);

        $scope.edit_right.right_count_type = $scope.form_edit_right.right_count_type =  $scope.nullIfundefine($scope.dict.currgtCountTyp)==null ? null : $scope.dict.currgtCountTyp.code_id;

        $scope.edit_right.right_entity_type = $scope.form_edit_right.right_entity_type = $scope.nullIfundefine($scope.dict.curentTyp)==null ? null : $scope.dict.curentTyp.code_id;

        $scope.edit_right.right_type = $scope.form_edit_right.right_type = $scope.nullIfundefine($scope.dict.currgtTyp)==null ? null : $scope.dict.currgtTyp.code_id;

        $scope.edit_right.rightOwners.push(angular.copy($scope.form_edit_right.rightOwner));

        ret_obj = angular.copy($scope.edit_right);

        return ret_obj;
    };

    $scope.preCreateRightOwnerPart = function() {

        $scope.form_edit_right.rightOwner.date_in = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_in); //$scope.timetoUTC($scope.form_edit_right.rightOwner.date_in);

        $scope.form_edit_right.rightOwner.date_out = $scope.timetoUTC($scope.form_edit_right.rightOwner.date_out);

        $scope.form_edit_right.right_owner_id = null;

        $scope.form_edit_right.rightOwner.parent_owner = null;

        $scope.form_edit_right.rightOwner.right_id = $scope.form_edit_right.right_id;

        $scope.form_edit_right.rightOwner.ooper = $scope.createOperObject();

        $scope.form_edit_right.rightOwner.ooper.parent_id_order = $scope.form_edit_right.ooper.ooperId;


    };

    $scope.postCreateRightOwnerPart = function(ret_val){

        if ( $scope.nullIfundefine(ret_val) != null){

            ret_val.owner = $scope.sel_subject[$scope.tabNum];

            $scope.edit_right.rightOwners.push(ret_val);

            $scope.form_edit_right.rightOwner = angular.copy(rightvar.rightOwner);//.right_owner_id = ret_val.rightOwners[0].right_owner_id;

            var bind_obj = $scope.form_edit_right.bindedObj;

            $scope.edit_right.bindedObj.address = bind_obj.address_dest != null ? bind_obj.address_dest.adr : bind_obj.address ;

            $scope.addToBuffer($scope.edit_right);

        }

    };

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

    };

    $scope.preUpdatePart = function() {

        var var_to_upd = angular.copy($scope.edit_right);


        $scope.form_edit_right.begin_date =  $scope.timetoUTC($scope.form_edit_right.begin_date);

        $scope.form_edit_right.end_date = $scope.timetoUTC($scope.form_edit_right.end_date);


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

        var buf_idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curId;}, {curId: $scope.form_edit_right.right_id});

        ////////////////////// Удаляем право //////////////////////


        if ($scope.nullIfundefine(ret_val.right_id) == null) {

            var search_idx = $scope.var.rightsDataSearch.findIndex(function (value) {return value.right_id == this.curType;}, {curId: $scope.form_edit_right.right_id});

            $scope.sel_buffer.splice(buf_idx, 1);

            $scope.var.rightsDataSearch.splice(search_idx, 1);

            $scope.edit_right = {};

            $scope.CleanEditForm();

            return;

        }

        var ret_val_idx = ret_val.rightOwners.findIndex(function (value) {return value.right_owner_id == this.curOwnerId;}, {curOwnerId: $scope.form_edit_right.rightOwner.right_owner_id});

        var r_own_idx = $scope.edit_right.rightOwners.findIndex(function (value) {return value.right_owner_id == this.curOwnerId;}, {curOwnerId:  $scope.form_edit_right.rightOwner.right_owner_id});

        ////////////////////// Изменяем  //////////////////////

        if ( ret_val_idx != -1) {

            ret_val.bindedObj = $scope.sel_object[$scope.tabNum];

            $scope.form_edit_right = $scope.copyRightForm(ret_val);

            $scope.copyRight($scope.form_edit_right, $scope.edit_right);

            $scope.copyRight($scope.edit_right, $scope.sel_buffer[buf_idx]);

            $scope.fillDictName($scope.edit_right);

            $scope.form_edit_right.rightOwner = $scope.copyRightOwnerForm(ret_val.rightOwners[ret_val_idx]);

            $scope.copyRightOwner($scope.form_edit_right.rightOwner, $scope.edit_right.rightOwners[r_own_idx]);

            $scope.copyRightOwner($scope.edit_right.rightOwners[r_own_idx], $scope.sel_buffer[buf_idx].rightOwners[r_own_idx]);

        } else {

            ////////////////////// Удаляем правообладателей  //////////////////////

            $scope.form_edit_right.rightOwner = {};

            $scope.edit_right.rightOwners.splice(r_own_idx, 1);

        }

    };

    ///////////////////////////// Checks part /////////////////////////////////////////////////////////////////

    $scope.checkTransBuffer = function(one_right, two_right, transf_active){

        var ret_val = false;

        if( (typeof one_right.bindedObj.obj_id != 'undefined') && (typeof two_right.bindedObj != 'undefined') &&

            (one_right.bindedObj.obj_id != two_right.bindedObj.obj_id)) {

            $scope.checked[$scope.tabNum][rec.right_id] = false;

            $scope.notif.show( $scope.ErrorMessage[25], "error");

            ret_val = true;
        }

        if (one_right.right_id == two_right.right_id) {

            $scope.checked[$scope.tabNum][one_right.right_id] = true;

            if( transf_active = 'FROM' ) { $scope.notif.show($scope.ErrorMessage[23], "warning"); }

            else if( transf_active = 'TO' ) { $scope.notif.show($scope.ErrorMessage[24], "warning"); }

            ret_val = true;
        }

        return ret_val;

    };

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
    };

    $scope.CreateRightOwnerCheck = function(to_check_right) {

        var ret_val = false;

        try {

            var fracion_check = new Fraction(to_check_right.rightOwner.numerator_part, to_check_right.rightOwner.denominator_part);

        }catch(err) {

            to_check_right.rightOwner.numerator_part = 0;

            to_check_right.rightOwner.denominator_part = 1;

            swal("Error", "В доле ошибка:  " + err + " исправлено на (0,1)", "error");

            ret_val = true;

        }

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
    };

    $scope.UpdateRightCheck = function(to_check_right) {

        var ret_val = false;

        try {

            var fracion_check = new Fraction(to_check_right.rightOwner.numerator_part, to_check_right.rightOwner.denominator_part);

        }catch(err) {

            to_check_right.rightOwner.numerator_part = 0;

            to_check_right.rightOwner.denominator_part = 1;

            swal("Error", "В доле ошибка:  " + err + " исправлено на (0,1)", "error");

            ret_val = true;

        }

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
    };

    $scope.summRightOwnersPart = function(rOwners){

        var summ = new Fraction(0);

        for(rOwner in rOwners){

            summ = summ.add(new Fraction(rOwners[rOwner].numerator_part, rOwners[rOwner].denominator_part));

        }

        return summ;

    };

    ///////////////////////////// Transform part //////////////////////////////////////////////////////////////

    $scope.transRightCheck = function(tdata){

        $scope.var.ErrorNotific = [];

        var err = { errorMessage:"", ID:"" };

        var double = [];

        var ret_val = false;

        for( var i = 0; i < tdata.length ; i++) {

            var fsumm = new Fraction(tdata[i].fromSumm);

            if( $scope.nullIfundefine(tdata[i].fromRoid) == null ) {

                err.errorMessage =  $scope.ErrorMessage[22];

                err.ID = "To Id = " + tdata[i].toRoid;

                $scope.var.ErrorNotific.push(angular.copy(err));

                ret_val = true;

                return ret_val;

            }

            if( $scope.nullIfundefine(tdata[i].toRoid) == null ) {

                err.errorMessage =  $scope.ErrorMessage[28];

                err.ID = "From Id = " + tdata[i].fromRoid;

                $scope.var.ErrorNotific.push(angular.copy(err));

                ret_val = true;

                return ret_val;

            }

            if( fsumm.compare(new Fraction(tdata[i].fromTeils)) > 0 ){

                err.errorMessage = $scope.ErrorMessage[18] + " " + $scope.BeautyFraction(fsumm)+ ">" + $scope.BeautyFraction(new Fraction(tdata[i].fromTeils));

                err.ID =  tdata[i].fromFIO;

                if(!double[tdata[i].fromId+''+ 18]) {

                    $scope.var.ErrorNotific.push(angular.copy(err));

                    double[tdata[i].fromId + '' + 18] = true;

                }

                ret_val = true;

            }

            if( tdata[i].transTeils.n == null || tdata[i].transTeils.n < 0 ) {

                err.errorMessage = $scope.ErrorMessage[20];

                err.ID =  "From Id = " + tdata[i].fromRoid ;

                $scope.var.ErrorNotific.push(angular.copy(err));

                ret_val = true;

            }

            if( tdata[i].transTeils.d == null || tdata[i].transTeils.d <= 0 ) {

                err.errorMessage = $scope.ErrorMessage[21];

                err.ID =  "From Id = " + tdata[i].fromRoid;

                $scope.var.ErrorNotific.push(angular.copy(err));

                ret_val = true;

            }

            if( $scope.nullIfundefine(tdata[i].ooper) == null || $scope.nullIfundefine(tdata[i].ooper.operType) == null) {

                err.errorMessage = $scope.ErrorMessage[29];

                err.ID =  "From To Id = " + tdata[i].toRoid;

                $scope.var.ErrorNotific.push(angular.copy(err));

                ret_val = true;

            }

        }

        return ret_val;

    };

    $scope.runtransRightCheck = function(data){

        var ret_val = false;

        var data_send = angular.copy(data);

        ///////////////////// подсчет общих сумм //////////////////////////////////////

        for( var i = 0; i < data_send.length ; i++) {

            var fromSumm = new Fraction(0,1);

            var toSumm = new Fraction(0,1);

            var num = data_send[i].transTeils.n;

            var de_num = data_send[i].transTeils.d;

            for( var j = 0; j < data_send.length ; j++) {

                if( data_send[i].fromRoid ==  data_send[j].fromRoid) {

                    if( data_send[j].transTeils.n != null && data_send[j].transTeils.d != null && data_send[j].transTeils.d != 0 )
                    {
                        fracion_check = new Fraction( data_send[j].transTeils.n, data_send[j].transTeils.d);

                    } else {

                        fracion_check = new Fraction(0,1);
                    }

                    fromSumm = fromSumm.add(fracion_check);

                }

            }

            data_send[i].fromSumm = fromSumm;

        }

        ret_val = $scope.transRightCheck(data_send);

        if(ret_val) {$scope.dispalyModal('#errorModal')};

        return ret_val;

    };

    $scope.updateTransRight = function() {

        $scope.var.loading = true;

        $scope.var.rightTransformCh = $scope.bringtoRight($scope.var.rightTransformCh);

        $http.post(DOMAIN + "/nka_net3/right/updRight?",  $scope.var.rightTransformCh).success(function (data, status, headers) {

            $scope.var.loading = false;

            $scope.fillDictName(data);

            var idx = $scope.sel_buffer.findIndex(function (value) {return value.right_id == this.curId; }, {curId: data.right_id});

            $scope.checked[$scope.tabNum][data.right_id] = false;

            $scope.sel_buffer[idx] = data;

            $scope.CleanTransForm();

            $scope.getAddress(data.bindedObj);

            swal("Ок", "Право обновлено", "success");

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

            swal("Error", data.message , "error");

        });

    };

    $scope.saveTransChange = function (e){

        if($scope.runtransRightCheck(e.sender._data)) { return;}

        var data = e.sender._data;

        for( var i = 0; i < data.length ; i++) {

            data[i].toTeils.n = data[i].transTeils.n;

            data[i].toTeils.d = data[i].transTeils.d;

        }

        $scope.rightRecalculate(data);

        $scope.updateTransRight();

    };

    $scope.showTransCheck = function() {

        if($scope.runtransRightCheck($scope.transTab._data)) { return;}

        var data = $scope.transTab._data;

        for( var i = 0; i < data.length ; i++) {

            data[i].toTeils.n = data[i].transTeils.n;

            data[i].toTeils.d = data[i].transTeils.d;

        }

        $scope.rightRecalculate(data);

        $scope.dispalyModal('#resTrans');

    };

    $scope.transTeilsChange = function(dataItem) {

        dataItem.toTeils.n = 0 ;

        dataItem.toTeils.d = 1 ;

    }

    $scope.rightRecalculate = function(data){

        /* Id: 0, fromFIO: "Дженкинс_1010 Владимир_10 Обамович_10", fromRoid: 1527, fromTeils: Object, toFIO: "Дженкинс_88 Владимир_8 Обамович_8",
         toRoid: 1528, toTeils: Object, transTeils: Object, transTeils.d: null,  transTeils.n: null */

        $scope.var.rightTransformCh = {} ;

        var right_transfer = $scope.var.rightTransformCh = angular.copy($scope.var.rightTransform);

        for ( var i = 0 ; i < data.length ; i++){

            var res_from = right_transfer.rightOwners.find(function(value){ return value.right_owner_id == this.curId ;},{curId:data[i].fromRoid});

            var res_fraction_from = new Fraction (res_from.numerator_part, res_from.denominator_part ).sub(new Fraction(data[i].transTeils));

            res_from.numerator_part = res_fraction_from.n;

            res_from.denominator_part = res_fraction_from.d;

            if (res_fraction_from.n == 0) {

                res_from.date_out = $scope.timetoUTC(new Date());

            }

            var res_to_idx = right_transfer.rightOwners.findIndex(function(value){ return value.right_owner_id == this.curId ;},{curId:data[i].toRoid});

            var res_to = angular.copy(right_transfer.rightOwners[res_to_idx]);

            res_to.numerator_part = data[i].toTeils.n ;

            res_to.denominator_part = data[i].toTeils.d;

            res_to.parent_owner = data[i].fromRoid ;

            res_to.date_in = $scope.timetoUTC(new Date());

            res_to.ooper = angular.copy(data[i].ooper);

            if ( right_transfer.rightOwners[res_to_idx].numerator_part == 0 ){

                right_transfer.rightOwners[res_to_idx].denominator_part = 1;

                right_transfer.rightOwners.splice(res_to_idx,1);

                right_transfer.rightOwners.push(angular.copy(res_to));

            } else {

                res_to.right_owner_id = null;

                right_transfer.rightOwners.push(angular.copy(res_to));

            }

        }


    };

    $scope.copytoMixRow = function(mixstr, rec, trans_part ) {

        if(trans_part == 'FROM') {

            mixstr.fromTeils.n = rec.numerator_part;

            mixstr.fromTeils.d = rec.denominator_part;

            mixstr.fromFIO = $scope.nullIfundefine(rec.owner.fullname) == null ? $scope.BeautyCast(rec.owner.surname, rec.owner.firstname, rec.owner.fathername) : rec.owner.fullname;

            mixstr.fromRoid = rec.right_owner_id;

        }

        if(trans_part == 'TO') {

            mixstr.toTeils.n = rec.numerator_part;

            mixstr.toTeils.d = rec.denominator_part;

            mixstr.toFIO = $scope.nullIfundefine(rec.owner.fullname) == null ? $scope.BeautyCast(rec.owner.surname, rec.owner.firstname, rec.owner.fathername) : rec.owner.fullname;

            mixstr.toRoid = rec.right_owner_id;


        }

        return mixstr;

    };

    $scope.transimageBlick = function(trans_part) {

        if(trans_part == 'FROM') {

            $timeout(function(){ $scope.transfer_img_left = "images/dfinger.jpg"; }, 500);

            $scope.transfer_img_left = "images/dfinger_color.jpg";
        }

        if(trans_part == 'TO') {

            $timeout(function(){ $scope.transfer_img_right = "images/dfinger.jpg"; }, 500);

            $scope.transfer_img_right = "images/dfinger_color.jpg";
        }



    };

    $scope.transDoc = function () {};

    $scope.transGruntOpen = function(dataItem) {

        $scope.transGruntClose.dataItem = dataItem;

        if(($scope.nullIfundefine(dataItem.ooper) != null) && ($scope.nullIfundefine(dataItem.ooper.operType) != null)){

            $scope.fillOper(dataItem);

        } else {

            $scope.dict.curoprTyp = {};

        }

        if(!$scope.nullIfundefine($scope.dict.curoprSubTyp)){ $scope.dict.filterSubTypes = []; };

        if(!$scope.nullIfundefine($scope.dict.curoprBase)){ $scope.dict.filterBases = []; };

        $scope.dispalyModal('#transgruntModal');

    };

    $scope.transGruntClose = function () {

        $('#transgruntModal').modal('hide');

        var curRow = $scope.transGruntClose.dataItem;

        if(curRow != "undefined"){

            var right_from  = $scope.var.rightsOwnersTransformFrom.find(function (value) {return value.right_owner_id == this.curId;},{curId:curRow.fromRoid});

            curRow.ooper = angular.copy(operationtvar);

            curRow.ooper.operType = $scope.nullIfundefine($scope.dict.curoprTyp) != null ? $scope.dict.curoprTyp.code_id : null ;

            curRow.ooper.operSubtype = $scope.nullIfundefine($scope.dict.curoprSubTyp) != null ? $scope.dict.curoprSubTyp.code_id : null;

            curRow.ooper.reason = $scope.nullIfundefine($scope.dict.curoprBase) != null ? $scope.dict.curoprBase.code_id : null;

            curRow.ooper.operDate =  $scope.timetoUTC(new Date());

            curRow.ooper.regDate =  $scope.timetoUTC(new Date());

            curRow.ooper.parent_id_hist = right_from.ooper.ooperId;

            curRow.ooper.parent_id_order = $scope.var.rightTransform.ooper.ooperId;

            $scope.var.mixTransformMap[curRow.Id].ooper = angular.copy(curRow.ooper);

        }

    };

    $scope.detachTrans = function (idx, trans_part){

        var copyMix = $scope.var.mixTransformMap[idx];

        if (trans_part == 'FROM'){

            copyMix.fromTeils.n = null;

            copyMix.fromTeils.d = null;

            copyMix.fromFIO = null;

            copyMix.fromRoid = null;

        }

        if (trans_part == 'TO'){

            copyMix.toTeils.n = null;

            copyMix.toTeils.d = null;

            copyMix.toFIO = null;

            copyMix.toRoid = null;

        }

        if ((copyMix.toRoid == null)&& (copyMix.fromRoid ==  null)) {

            for( var i = idx+1 ; i < $scope.var.mixTransformMap.length ; i++ ){

                $scope.var.mixTransformMap[i].Id = i-1;

            }

            $scope.var.mixTransformMap.splice(idx, 1) ;

        }

        $scope.refreshMixGrid();

    };

    $scope.OnTransSelect = function (rec, trans_part) {

        if (typeof rec.is_limit == "undefined" && trans_part == "FROM") {

            $scope.setTransLimitations(rec, $scope.addToMix);

        } else {

            $scope.addToMix(rec,trans_part);

        }

    };

    $scope.addToMix = function(rec,trans_part){

        if(rec.is_limit) { swal("Error", $scope.ErrorMessage[30] , "error"); return; }

        var mixRow = angular.copy($scope.mixMap);

        $scope.transimageBlick(trans_part);

        if(trans_part == 'FROM') {

            var idx = $scope.var.mixTransformMap.findIndex(function(value){ return value.fromRoid == null });

        };

        if(trans_part == 'TO') {

            var idx = $scope.var.mixTransformMap.findIndex(function(value){ return value.toRoid == null });

        };

        if (idx == -1) {

            $scope.copytoMixRow(mixRow,rec,trans_part);

            mixRow.Id = $scope.var.mixTransformMap.length;

            $scope.var.mixTransformMap.push(mixRow);

        }

        else { $scope.copytoMixRow($scope.var.mixTransformMap[idx], rec, trans_part); }

        $scope.refreshMixGrid();

    };

    $scope.refreshMixGrid = function(){

        $scope.transTab.dataSource.read();

        $scope.transTab.refresh();

    };

    $scope.setTransLimitations = function(rec, callback) {

        var right_own  = $scope.var.rightTransform.rightOwners.find(function (value) {return value.right_owner_id == this.curId;},{curId:rec.right_owner_id});

        $scope.var.url = DOMAIN + "/nka_net3/right/getLimitObject?right_id=" + "&right_owner_id=" + rec.right_owner_id;

        $http.get($scope.var.url).success(function (res) {

            res.length >0 ? right_own.is_limit = true : right_own.is_limit = false;

            if(callback) { callback(right_own,'FROM')};

        }).error(function (data, status, header, config) {

            $scope.var.loading = false;

            swal("Error", data.message, "error");

        });

    };

    $scope.closeTransWin = function() {

        $('#resTrans').modal('hide')

    };

    $scope.CleanTransForm = function(){

        $scope.var.rightsOwnersTransformTo = [];

        $scope.var.rightsOwnersTransformFrom = [];

        $scope.var.rightTransformCh = {};

        $scope.var.rightTransform = {};

        $scope.var.mixTransformMap.splice(0,$scope.var.mixTransformMap.length);

        $scope.refreshMixGrid();

    };

    ///////////////////////////// document upload /////////////////////////////////////////////////////////////////

    $scope.uploadFile = function() {

        $scope.file_to_upload = angular.element(document.querySelector('#fileUpl'))[0].files;

        var data_f = new FormData();

        var docdesc = {"doc_id":25935};

        data_f.append("file", $scope.file_to_upload);

        data_f.append("doc_desc", docdesc);

       // data_f.append("doc_desc", doc_desc);

       // console.log(data_f);

       // var data = {"doc_desc":{"doc_id":456876} ,"file":$scope.file_to_upload};  Content-Type=multipart/form-data

        $http.post(DOMAIN + "/nka_net3/doc/upload", data_f, { headers: {'Content-Type': undefined} ,transformRequest: angular.identity } ).success(function(data, status, headers){

                console.log("Data");


            }).error(function (data, status, header, config) {

                $scope.var.loading = false;

                $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

                console.log("data");

                console.log(data);

                console.log("status");

                console.log(status);

                console.log("headers");

                console.log(header);

                console.log("config");

                console.log(config);

            });
        ;




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

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.fillDictName = function(right) {

        right.right_type_name = $scope.dict.rightTypes.find(this.initType,{curType:right.right_type}).code_name;

        right.right_entity_type_name = $scope.dict.rightEntityTypes.find(this.initType,{curType:right.right_entity_type}).code_name;

        right.right_count_type_name = $scope.dict.rightCountTypes.find(this.initType,{curType:right.right_count_type}).code_name;

    };

    $scope.fillOper = function(right_own) {

        $scope.dict.curoprTyp = $scope.dict.operTypes.find(this.initType,{curType:right_own.ooper.operType});

        $scope.dict.curoprSubTyp = $scope.dict.operSubTypes.find(this.initType,{curType:right_own.ooper.operSubtype});

        $scope.dict.curoprBase = $scope.dict.operBases.find(this.initType,{curType:right_own.ooper.reason});

        $scope.dict.filterSubTypes = [$scope.dict.curoprSubTyp];

        $scope.dict.filterBases = [$scope.dict.curoprBase];

    };

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

    };

    $scope.normRightOwner = function(edit_right_val) {

        var norm_right_own = angular.copy(edit_right_val.rightOwners);

        if ($scope.nullIfundefine(norm_right_own.length) == null) {return;}

        for ( var item = 0 ; item < norm_right_own.length; item ++) {

            var right_owner = angular.copy(norm_right_own[item]);

            delete norm_right_own[item]['parent_owner_obj'];

            delete norm_right_own[item]['limit_rights'];

            delete norm_right_own[item]['is_limit'];

            delete norm_right_own[item]['owner'];

            norm_right_own[item]['owner'] = {subjectId:right_owner.owner.subjectId};

        }

        return norm_right_own;
    };

    ////////////////////// копирование права на объект и на форму /////////////////////////////////////////////

    $scope.copyRightForm = function(var_from){

        var var_to = angular.copy(rightvar);

        $scope.copyRight(var_from, var_to);

        $scope.dict.currgtTyp = $scope.dict.rightTypes.find(this.initType ,{curType:$scope.edit_right.right_type});

        $scope.sel_object[$scope.tabNum] = angular.copy($scope.edit_right.bindedObj);

        $scope.setRightFilterType();

        $scope.setRightType();

        return var_to;

    };

    $scope.copyRight = function(var_from, var_to){

        //////////////////////////////другие поля ////////////////////////////////////////

        if ($scope.nullIfundefine(var_from.bindedObj.address) == null) { $scope.getAddress(var_from.bindedObj) }

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


    };

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

    };

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

    };

    //////////////////////////////////////////////// функции очистки форм и пр... ////////////////////////////////////////

    $scope.CleanEditForm = function() {

        $scope.form_edit_right = angular.copy(rightvar);

        $scope.sel_object.splice(2,1); /////// чистим объект на форме


        $scope.dict.currgtTyp = '';

        $scope.dict.currgtCountTyp = '';

        $scope.dict.curentTyp = '';


        $scope.dict.curoprTyp = '';

        $scope.dict.curoprSubTyp = '';

        $scope.dict.curoprBase = '';

        $scope.limitHide = true;

    };

    $scope.CleanForm = function(){

        $scope.sel_param = '';

        $scope.checked[$scope.tabNum]=[];

        $scope.var.rightsDataSearch = [];

        var pos =  $scope.sbj_class.indexOf("active");

        pos == -1 ? $scope.sel_subject[$scope.tabNum] = {} : $scope.sel_object[$scope.tabNum] = {};

        $scope.rightsDataSearchTabHide=true;

    };

    $scope.CleanOperForm = function(){

        $scope.dict.filterSubTypes = [];

        $scope.dict.filterBases = [];

    };

    //////////////////////////////////////////////// служебные функции ////////////////////////////////////////

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

        ret_date = new Date(Date.UTC( sub_date.getFullYear(), sub_date.getMonth() , sub_date.getDate(), 0, 0, 0));

        return ret_date;

    };

    $scope.BeautyCast = function(var_one, var_two, var_three) {

        return (var_one + ' ' + var_two +' '+ var_three).replace(/null/g,'').trim();

    };

    $scope.BeautyFraction = function(numerator_part,denominator_part) {

        var fraction =  new Fraction(numerator_part, denominator_part);

        return fraction.n==0?"":fraction.n + (denominator_part==1 ?"":"/" + fraction.d);

    };

    $scope.BeautyFractionT = function(fraction) {

        var frac = new Fraction(fraction.n,fraction.d);

        return frac.n==0?"":frac.n + (frac.d==1 ?"":"/" + frac.d)
    };

    $scope.ChgKendoGridTitle = function(name) {

        var kendoObj = $("#kg").data("kendoGrid");

        $scope.mainGridOptions.columns[0].title = name;

        if ($scope.nullIfundefine(kendoObj) != null){

            kendoObj.dataSource.read();

            kendoObj.refresh();
        }

    };

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

    $scope.setActiveTab(1);

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $scope.copyOperLimitonForm = function() {

        $scope.form_edit_right.rightOwner = $scope.copyRightOwnerForm($scope.edit_right.rightOwners[0]);

        $scope.fillOper($scope.form_edit_right.rightOwner);

    };

    $scope.refreshEditPanel = function(){

        $scope.editGridOption.dataSource.data = $scope.edit_right.rightOwners;

    };

    $scope.zeroFilterDataItem = function(dataItem){

        var ret_val = dataItem === undefined ? null : dataItem.rightOwners.filter(function (value) {return value.numerator_part == 0;});


        return ret_val;

    };

    $scope.nonzeroFilterDataItem = function(dataItem){

        var ret_val = dataItem === undefined ? null : dataItem.rightOwners.filter(function (value) {return value.numerator_part != 0;});


        return ret_val;

    };


    /////////////////////////////////////////new part/////////////////////////////////////////////////////////////

    $scope.groupName = function(row_id) {

        var dataItems = $scope.editGridOption.dataSource.data.filter(function (value) {return value.owner.subjectId == this.curType;}, {curType: row_id});

        var summ = $scope.summRightOwnersPart(dataItems);

        var dataItem = dataItems[0];

        var ret_val = dataItem.owner.fullname === undefined?$scope.BeautyCast(dataItem.owner.surname,dataItem.owner.firstname,dataItem.owner.fathername):dataItem.owner.fullname ;

        ret_val = ret_val+ " ( Сумма доли = "+(summ.n+ "/" + summ.d) +" )";

        return ret_val;
    };

    $scope.onSelect = function(e) {


        var message = $.map(e.files, function(file) { return file.name; }).join(", ");

        console.log("event :: select (" + message + ")");

    }

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function Create2DArray(rows) {

        var arr = [];

        for (var i=0; i<rows; i++) {  arr[i] = []; }

        return arr;

    };

    function initTabs() {

        tabClasses = ["","","","",""];

    };

    function onEditPanelChange(e){

        var selectedRow = this.select();

        $scope.editGridOption.selectedDataItem = {}

        $scope.editGridOption.selectedDataItem = this.dataItem(selectedRow);

        $scope.form_edit_right = $scope.copyRightForm($scope.edit_right);

        $scope.form_edit_right.rightOwner = $scope.copyRightOwnerForm($scope.editGridOption.selectedDataItem);

        $scope.refreshEditPanel();

    };

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////

});


