"use strict";var app=angular.module("assetsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","angularBootstrapNavTree"]).constant("DOMAIN",""+window.location.protocol+"//"+window.location.hostname+":8080").config(["$routeProvider","$httpProvider",function(a,b){b.defaults.useXDomain=!0,a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/orders",{templateUrl:"views/orders.html",controller:"OrdersCtrl"}).when("/order/:id",{templateUrl:"views/order.html",controller:"OrderCtrl"}).when("/order",{templateUrl:"views/order.html",controller:"OrderCtrl"}).when("/object",{templateUrl:"views/object.html",controller:"ObjectCtrl"}).when("/doc",{templateUrl:"views/doc.html",controller:"DocCtrl"}).when("/subject",{templateUrl:"views/subject.html",controller:"SubjectCtrl"}).when("/items",{templateUrl:"views/items.html",controller:"ItemsCtrl"}).when("/dict",{templateUrl:"views/catalogs.html",controller:"CatalogCtrl"}).when("/dependency",{templateUrl:"views/dependency.html",controller:"DependencyCtrl"}).when("/test",{templateUrl:"views/test.html",controller:"TestCtrl"}).otherwise({redirectTo:"#/"})}]).run(["$timeout","$location","$rootScope",function(a,b,c){c.text={general:"ГЛАВНАЯ",settings:"НАСТРОЙКИ",exit:"ВЫХОД",technicalSupport:"Тех поддержка"}}]).directive("modal",function(){return{template:'<div class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="modal()">&times;</button><h4 class="modal-title">{{ title }}</h4></div><div class="modal-body" ng-transclude></div></div></div></div>',restrict:"E",transclude:!0,replace:!0,scope:!0,link:function(a,b,c){a.title=c.title,a.$watch(c.visible,function(a){$(b).modal(1==a?"show":"hide")}),$(b).on("shown.bs.modal",function(){a.$apply(function(){a.$parent[c.visible]=!0})}),$(b).on("hidden.bs.modal",function(){a.$apply(function(){a.$parent[c.visible]=!1})})}}}).filter("filterSubjectType",function(){return function(a){var b=[];if(void 0!=a)for(var c=0;c<a.length;c++){var d=a[c];d.code_id<500&&(100==d.code_id||200==d.code_id||d.code_id>=300)&&b.push(d)}return b}}).filter("filterSubjectTypeForCreate",function(){return function(a){var b=[];if(void 0!=a)for(var c=0;c<a.length;c++){var d=a[c];d.code_id<200&&100!=d.code_id&&b.push(d)}return b}}).directive("clickAnywhereButHere",["$document",function(a){return{restrict:"A",link:function(b,c,d){c.bind("click",function(a){a.stopPropagation()}),a.bind("click",function(){b.$apply(d.clickAnywhereButHere)})}}}]);angular.module("assetsApp").value("ordervar",{typeSearch:{id:""},searchSubject:{number:"",fioAndName:""},operationTypes:[{prelabel:"",label:"Гос. регистрация",children:[{prelabel:"Гос. регистрация",label:"изменение"},{prelabel:"Гос. регистрация",label:"создание"}]}],selectedSubjects:[],bases:[{prelabel:"",label:"Выделение участка",children:[{prelabel:"Выделение участка",label:"документ"},{prelabel:"Выделение участка",label:"создание"}]}],doctypes:[{id:1,name:"Авизо"},{id:2,name:"Акт"},{id:3,name:"Вид на жительство "},{id:4,name:"Выписка"},{id:5,name:"Государственный акт"},{id:6,name:"Доверенность"},{id:7,name:"Договор (соглашение)"},{id:8,name:"Заявление"},{id:9,name:"Землеустроительное дело"},{id:10,name:"Иной документ "},{id:11,name:"Определение"},{id:12,name:"Паспорт"},{id:13,name:"Предписание"},{id:14,name:"Приговор"}],objecttypes:[{id:1,name:"Объект"},{id:2,name:"ПИК"},{id:2,name:"Право"},{id:4,name:"Доля"},{id:5,name:"Дело"},{id:6,name:"Право перехода"}],items:null,typeClient:null,showModal:!1,showPanel1P:!1,showPanel2:!1,showPanel3:!1,showSubjectsTable:!1,representativeActive:"",clientActive:"active",ates:[{label:"loading"}],openVar:"",states:[],order:"",decl:{},operationBase:null,operationSubType:null,operationType:null}),angular.module("assetsApp").controller("MainCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("assetsApp").controller("OrdersCtrl",["$scope","$http","$location","DOMAIN","ordervar",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.showId=[],a.init=function(){a.showLoading=!0,b.get(d+"/nka_net3/decl/get_journal").then(function(b){a.orders=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.getOrderById=function(a){c.path("/order/"+a)},a.newOrder=function(){b.get(d+"/nka_net3/decl/new_decl").then(function(a){c.path("/order/"+a.data.decl_id)})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.filterIdenticalSubject=function(b,c,d){var e=!0;return 2==b.declrepr_type&&(e=-1==a.showId.indexOf(b.person.subjectId),a.showId.push(b.person.subjectId)),c+1==d.length&&(a.showId=[]),e},a.getLast=function(a){var b=a[0];if(a.length>1)for(var c=1;c<a.length;c++)b=a[c].resolutionDate>b.resolutionDate?a[c]:b;return b}}]),angular.module("assetsApp").controller("OrderCtrl",["$scope","$http","$routeParams","httpServices","ordervar","DOMAIN",function(a,b,c,d,e,f){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a["var"]={},a["var"].searchSubject={number:" ",fioAndName:" "},a["var"]=angular.copy(e),a["var"].id=c.id,a.selectedClient=[],a.showId=[],a.init=function(){a.getDecl(),b.get(f+"/nka_net3/catalog/states").then(function(b){a["var"].states=b.data,a["var"].client={sitizens:a["var"].states[81]},a["var"].represent={sitizens:a["var"].states[81]}}),b.get(f+"/nka_net3/catalog/subjectTypes").then(function(b){a["var"].subjecttypes=b.data}),b.get(f+"/nka_net3/catalog/operationType").then(function(b){a["var"].operationType=b.data}),b.get(f+"/nka_net3/catalog/operationSubType").then(function(b){a["var"].operationSubType=b.data}),b.get(f+"/nka_net3/catalog/operationBase").then(function(b){a["var"].operationBase=b.data})},a.searchSubjects=function(){void 0!=a["var"].typeSearch.code_id?(a["var"].showSubjectsTable=!0,a["var"].subjects=[],delete b.defaults.headers.common["X-Requested-With"],d.searchSubjects(a["var"].typeSearch.code_id,a["var"].searchSubject.number,a["var"].searchSubject.fioAndName,a)):alert("Не выбран тип субъекта!")},a.searchPass=function(){a.validId()&&a.validPass()?(a["var"].showSubjectsTable=!0,a["var"].subjects=[],delete b.defaults.headers.common["X-Requested-With"],d.searchPass(a["var"].searchSubject.passSeriesAndNumber,a["var"].searchSubject.idNumber,a)):alert("Ошибочно заполненны поля!")},a.updateSubjectForm=function(b){a["var"].subjects=[],a["var"].showSubjectsTable=!1,"active"==a["var"].clientActive&&(a["var"].typeClient={code_id:JSON.parse(b).subjectType.code_id},a["var"].client=angular.copy(JSON.parse(b)),a["var"].client.bothRegDate=new Date(angular.copy(JSON.parse(b)).bothRegDate)),"active"==a["var"].representativeActive&&(a["var"].typeRepresent={code_id:JSON.parse(b).subjectType.code_id},a["var"].represent=angular.copy(JSON.parse(b)),a["var"].represent.bothRegDate=new Date(angular.copy(JSON.parse(b)).bothRegDate))},a.representativeActivate=function(){a["var"].representativeActive="active",a["var"].clientActive=""},a.clientActivate=function(){a["var"].representativeActive="",a["var"].clientActive="active"},a.say=function(b){a["var"].doctype=b},a.open=function(){a["var"].openVar="open"==a["var"].openVar?"":"open"},a.updateSubject=function(){"active"==a["var"].clientActive&&(d.updateSubject(a["var"].client),a["var"].client={},a["var"].typeClient=null),"active"==a["var"].representativeActive&&(d.updateSubject(a.represent),a["var"].represent={},a["var"].typeRepresent=null)},a.pushSubject=function(){var b={type:""};"active"==a["var"].clientActive?(b=angular.copy(a["var"].client),b.type="заказчик",b.name=(void 0!=a["var"].client.firstname?a["var"].client.firstname:"")+" "+(void 0!=a["var"].client.surname?a["var"].client.surname:"")+" "+(void 0!=a["var"].client.shortname?a["var"].client.shortname:""),a["var"].client={}):(b=angular.copy(a["var"].represent),b.type="представитель",b.name=(void 0!=a["var"].represent.firstname?a["var"].represent.firstname:"")+" "+(void 0!=a["var"].represent.surname?a["var"].represent.surname:"")+" "+(void 0!=a["var"].represent.shortname?a["var"].represent.shortname:""),a["var"].represent={}),a["var"].selectedSubjects.push(b)},a.modalSubject=function(b){a["var"].modalSubjects=angular.copy(b),a.showSubject=!a.showSubject},a.isObject=function(a){return null==a?!1:a instanceof Date?!1:"object"==typeof a},a.validPass=function(){var b=/^[A-Z,a-z]{2}(\d){7}$/;return b.test(a["var"].searchSubject.passSeriesAndNumber)},a.validId=function(){var b=/^(\d){7}[A-Z,a-z](\d){3}[A-Z,a-z]{2}(\d)$/;return b.test(a["var"].searchSubject.idNumber)},a.getDecl=function(){a.showLoading=!0,b.get(f+"/nka_net3/decl/get_decl",{params:{id:c.id}}).then(function(b){a["var"].decl=b.data,a.showLoading=!1})},a.deleteSubject=function(d){if(confirm("Вы уверены что хотите удалить субъекта?")){var e=a.searchDependSubjectIds(d);a.selectedClient.splice(a.selectedClient.indexOf(d.declarantId),1),b["delete"](f+"/nka_net3/decl/delete_subject_in_decl",{params:{idDecl:c.id,declarantIds:e}}).then(function(){a.getDecl()})}},a.setStatus=function(d){a.showLoading=!0,b.post(f+"/nka_net3/decl/status",{status:d,declId:c.id}).then(function(b){a["var"].decl=b.data,a.showLoading=!1})},a.addSubject=function(d){b.post(f+"/nka_net3/decl/add_subject_in_decl",{idDecl:c.id,idSubject:d,type:a["var"].representativeActive?2:1,clients:a.selectedClient}).then(function(){a.getDecl()}),a.selectedClient=[],a["var"].represent={},a["var"].typeRepresent={}},a.getLast=function(a){if(void 0!=a){var b=a[0];if(a.length>1)for(var c=1;c<a.length;c++)b=a[c].resolutionDate>b.resolutionDate?a[c]:b;return b}},a.changeDecltype=function(){a.showLoading=!0,b.put(f+"/nka_net3/decl/change_decltype",c.id).then(function(){a.getDecl(),a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.addOperation=function(){a.showLoading=!0,b.post(f+"/nka_net3/operations/add",{declId:c.id,operType:a.operationType,operSubtype:a.operationSubType,reason:a.operationBase}).then(function(){a.operationType={},a.operationSubType={},a.operationBase={},a.getDecl(),a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.deleteOperation=function(d){confirm("Вы уверены что хотите удалить операцию?")&&(a.showLoading=!0,b["delete"](f+"/nka_net3/operations/delete",{params:{idDecl:c.id,ooperId:d}}).then(function(){a.showLoading=!1,a.getDecl()})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}))},a.checkChosen=function(b){for(var c=!1,d=0;d<a.selectedClient.length;d++)a.selectedClient[d]==b&&(c=!0);return c},a.selectClient=function(b){0==a.checkChosen(b)?a.selectedClient.push(b):a.selectedClient.splice(a.selectedClient.indexOf(b),1)},a.filterSubject=function(a){return 1==a.declrepr_type?!0:!1},a.filterIdenticalSubject=function(b,c,d){var e=!0;return 2==b.declrepr_type&&(e=-1==a.showId.indexOf(b.person.subjectId),a.showId.push(b.person.subjectId)),c+1==d.length&&(a.showId=[]),e},a.searchDependSubjectIds=function(b){var c=[];1==b.declrepr_type&&c.push(b.declarantId);for(var d=0;d<a["var"].decl.declarants.length;d++)2!=a["var"].decl.declarants[d].declrepr_type||a["var"].decl.declarants[d].person.subjectId!=b.person.subjectId&&a["var"].decl.declarants[d].parentPerson.person.subjectId!=b.person.subjectId||c.push(a["var"].decl.declarants[d].declarantId);return c},a.getRelatedSubject=function(b){for(var c=[],d=0;d<a["var"].decl.declarants.length;d++)a["var"].decl.declarants[d].person.subjectId==b.person.subjectId&&2==a["var"].decl.declarants[d].declrepr_type&&c.push(a["var"].decl.declarants[d]);return c}}]),angular.module("assetsApp").controller("ObjectCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a["var"]={objecttypes:[{id:1,name:"Объект"},{id:2,name:"Право"},{id:3,name:"Сделка"},{id:4,name:"ПИК"},{id:5,name:"Доля права"},{id:6,name:" Переход права"}],typeFormations:[{id:1,name:"Строение"},{id:2,name:"Участок"},{id:3,name:"Часть строения"}],typeRights:[{id:1,name:"Собственность"},{id:2,name:"Пожизненное наследуемое владение"},{id:3,name:"Постоянное пользование"},{id:4,name:"Временное пользование"},{id:5,name:"Хозяйственное ведение"},{id:6,name:"Оперативное управление"},{id:7,name:"Сервитут"},{id:8,name:"Доверительное управление"},{id:9,name:"Рента"},{id:10,name:"Залог"},{id:11,name:"Аренда"},{id:12,name:"Безвозмездное пользование"},{id:13,name:"Ограничения (обременения) прав в использовании земель"},{id:14,name:"Ограничения (обременения) прав, установленные законодательством"},{id:15,name:"Ограничения (обременения) прав, установленные уполномоченными органами"}],typeBargains:[{id:1,name:"Адресная продажа"},{id:2,name:"Аукцион"}],message:{title:"",html:""}},a.showModalDoc=!1,a.showModalObject=!1,a.modalDoc=function(){a.showModalDoc=!a.showModalDoc},a.modalObject=function(){a.showModalObject=!a.showModalObject}}]),angular.module("assetsApp").controller("SubjectCtrl",["$scope","$http","$location","httpServices","DOMAIN",function(a,b,c,d,e){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a["var"]={loading:!1,states:"",items:"",subjecttypes:"",ates:[{label:"loading"}]},a.init=function(){a["var"].loading=!0,b.get(e+"/nka_net3/catalog/states").then(function(b){a["var"].states=b.data,a["var"].subj={sitizens:a["var"].states[81]},a["var"].loading=!1}),b.get(e+"/nka_net3/catalog/subjectTypes").then(function(b){a["var"].subjecttypes=b.data,a["var"].loading=!1})},a.searchSubjects=function(){void 0!=a["var"].typeSearch?(a["var"].loading=!0,a["var"].subj=[],delete b.defaults.headers.common["X-Requested-With"],d.searchSubjects(a["var"].typeSearch.code_id,a["var"].searchSubject.number,a["var"].searchSubject.fioAndName,a)):alert("Не выбран тип субъекта!")},a.updateSubjectForm=function(b){a["var"].subj=[],a["var"].showSubjectsTable=!1,a["var"].subjtype=JSON.parse(b).subjectType,a["var"].subj=angular.copy(JSON.parse(b)),a["var"].subj.bothRegDate=new Date(angular.copy(JSON.parse(b)).bothRegDate)},a.searchPass=function(){a.validId()&&a.validPass()?(a["var"].loading=!0,a["var"].subjects=[],delete b.defaults.headers.common["X-Requested-With"],d.searchPass(a["var"].searchSubject.passSeriesAndNumber,a["var"].searchSubject.idNumber,a)):alert("Ошибочно заполненны поля!")},a.pushSubject=function(c){var d=e+"/nka_net3/subject/add";c.subjectType=angular.copy(a["var"].subjtype),b.post(d,c)["catch"](function(a){alert(JSON.stringify(a.data))}),a["var"].subj={}},a.updateSubject=function(c){var d=e+"/nka_net3/subject/update";c.subjectType=angular.copy(a["var"].subjtype),b.put(d,c),a["var"].subj={}},a.validPass=function(){var b=/^[A-Z,a-z]{2}(\d){7}$/;return b.test(a["var"].searchSubject.passSeriesAndNumber)},a.validId=function(){var b=/^(\d){7}[A-Z,a-z](\d){3}[A-Z,a-z]{2}(\d)$/;return b.test(a["var"].searchSubject.idNumber)}}]),angular.module("assetsApp").controller("DocCtrl",["$scope","$http","$location",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a["var"]={doctypes:[{id:1,name:"Авизо"},{id:2,name:"Акт"},{id:3,name:"Вид на жительство "},{id:4,name:"Выписка"},{id:5,name:"Государственный акт"},{id:6,name:"Доверенность"},{id:7,name:"Договор (соглашение)"},{id:8,name:"Заявление"},{id:9,name:"Землеустроительное дело"},{id:10,name:"Иной документ"},{id:11,name:"Определение"},{id:12,name:"Паспорт"},{id:13,name:"Предписание"},{id:14,name:"Приговор"},{id:15,name:"Приказ"},{id:16,name:"Протокол"},{id:17,name:"Разрешение"},{id:18,name:"Регистрационное удостоверение"},{id:19,name:"Решение"},{id:20,name:"Сведения"},{id:21,name:"Свидетельство"},{id:15,name:"Справка"},{id:16,name:"Технический паспорт"},{id:17,name:"Уведомление"},{id:18,name:"Удостоверение"},{id:19,name:"Указ"},{id:20,name:"Указание"},{id:21,name:"Устав"}]}}]),angular.module("assetsApp").controller("ItemsCtrl",["$scope","$http","$location",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("assetsApp").factory("httpServices",["DOMAIN",function(a){var b={},c=[function(){return new XMLHttpRequest},function(){return new ActiveXObject("Msxml2.XMLHTTP")},function(){return new ActiveXObject("Msxml3.XMLHTTP")},function(){return new ActiveXObject("Microsoft.XMLHTTP")}],d=function(){for(var a=!1,b=0;b<c.length;b++){try{a=c[b]()}catch(d){continue}break}return a};return b.updateSubject=function(b){var c=a+"/nka_net3/subject/update",e="?",f="PUT";for(var g in b)"bothRegDate"!=g&&"datestart"!=g?e+=""+g+"="+b[g]+"&":null!=b[g]&&(e+=""+g+"="+b[g].valueOf()+"&");var h=d();h.open(f,c+e,!0),h.send()},b.searchSubjects=function(b,c,e,f){var g=a+"/nka_net3/subject/search",h="?type="+b+"&number="+c+"&name="+e,i="GET",j=d();return j.open(i,g+h,!0),j.send(),j.onreadystatechange=function(){4==j.readyState&&(f["var"].loading=!1,200==j.status&&(f["var"].subjects=JSON.parse(j.responseText),f["var"].showSubjectsTable=!0,0==f["var"].subjects.length&&(f["var"].showSubjectsTable=!1),f.$apply()))}},b.searchPass=function(b,c,e){var f=a+"/nka_net3/subject/mvd",g="?seriesAndNumber="+b+"&idNumber="+c,h="GET",i=d();return i.open(h,f+g,!0),i.send(),i.onreadystatechange=function(){4==i.readyState&&(e["var"].loading=!1,200==i.status&&(e["var"].subjects=JSON.parse(i.responseText),e["var"].showSubjectsTable=!0,0==e["var"].subjects.length&&(e["var"].showSubjectsTable=!1),e.$apply()))}},b.addSubject=function(b){var c=a+"/nka_net3/subject/add",e="?",f="POST",g=d();g.open(f,c+e,!0),g.send(JSON.stringify(b))},b}]),angular.module("assetsApp").controller("CatalogCtrl",["$scope","$http","$location","DOMAIN",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.item={analytic_type:null},a.showCatalog=!1,a.modalCatalog={},a.showNewCatalog=!1,a.selectedType=null,a.selectedItem=null,a.modal=function(b){a.selectedItem=b.code_id,a.modalCatalog=angular.copy(b),a.showCatalog=!a.showCatalog},a.init=function(){a.loadTypes()},a.loadTypes=function(){a.showLoading=!0,b.get(d+"/nka_net3/catalog/get_all_types").then(function(b){a.catalogTypes=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.loadCatalogs=function(c){a.selectedType=c,a.showLoading=!0,b.get(d+"/nka_net3/catalog/get_catalogs_by_type",{params:{type:c}}).then(function(b){a.catalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}),a.item.analytic_type=c},a.deleteCatalog=function(c){confirm("Вы действительно хотите удалить запись?")&&(a.showCatalog=!1,a.showLoading=!0,b["delete"](d+"/nka_net3/catalog/delete_catalog_by_id",{params:{analytic_type:c.analytic_type,code_id:c.code_id}}).then(function(b){a.catalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}),a.showCatalog=!1)},a.deleteType=function(c){confirm("Вы действительно хотите удалить запись?")&&(a.showLoading=!0,b["delete"](d+"/nka_net3/catalog/deleted_type_by_id",{params:{analytic_type:c}}).then(function(){a.loadTypes(),a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}))},a.updateCatalog=function(c){confirm("Сохранить изменения?")&&(a.showLoading=!0,b.put(d+"/nka_net3/catalog/update_catalog",{analytic_type:c.analytic_type,code_id:c.code_id,code_name:c.code_name,code_short_name:c.code_short_name,n_prm1:c.n_prm1,v_prm1:c.v_prm1,status:c.status,parent_code:c.parent_code,unitmeasure:c.unitmeasure}).then(function(b){a.catalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}),a.showCatalog=!1)},a.modalNewCatalog=function(){null!=a.item.analytic_type?a.showNewCatalog=!a.showNewCatalog:alert("Не выбран тип")},a.modalNewType=function(){a.showNewType=!a.showNewType},a.addNewCatalog=function(c){a.showLoading=!0,b.post(d+"/nka_net3/catalog/add_catalog",{analytic_type:c.analytic_type,code_id:c.code_id,code_name:c.code_name,code_short_name:c.code_short_name,n_prm1:c.n_prm1,v_prm1:c.v_prm1,status:c.status,parent_code:c.parent_code,unitmeasure:c.unitmeasure}).then(function(b){a.catalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}),a.showNewCatalog=!1},a.addNewType=function(c){a.showLoading=!0,b.post(d+"/nka_net3/catalog/add_catalog_type",{analytic_type:c.analytic_type,analyticTypeName:c.analyticTypeName,status:c.status}).then(function(){a.loadTypes(),a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")}),a.showNewType=!1}}]),angular.module("assetsApp").controller("DependencyCtrl",["$scope","$http","$location","DOMAIN",function(a,b,c,d){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"],a.catalogTypes={},a.currentParentId=null,a.selectedParentItem=null,a.currentDependencyId=null,a.init=function(){a.loadTypes()},a.loadTypes=function(){a.showLoading=!0,b.get(d+"/nka_net3/catalog/get_all_types").then(function(b){a.catalogTypes=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.loadDependency=function(c){a.selectedParentId=c,b.get(d+"/nka_net3/catalog/get_catalog_dependency_by_parent_id",{params:{parentId:c}}).then(function(b){a.catalogDependency=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.showListDependency=function(b){a.selectedParentId=b,a.showListTypes=!0},a.addDependency=function(c){a.showLoading=!0,b.post(d+"/nka_net3/catalog/add_analytic_dependency",{parentAnalyticTypeId:a.selectedParentId,analyticTypeId:c}).then(function(b){a.catalogDependency=b.data,a.showLoading=!1,a.showListTypes=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.deleteDependencyType=function(c){a.showLoading=!0,b["delete"](d+"/nka_net3/catalog/delete_analytic_dependency",{params:{id:c}}).then(function(b){a.catalogDependency=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.loadCatalogItems=function(c,e,f){a.showLoading=!0,a.selectedDependedType=e,a.currentDependencyId=f,b.get(d+"/nka_net3/catalog/get_catalogs_by_type",{params:{type:c}}).then(function(b){a.parentCatalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.loadDependedItem=function(c){a.showLoading=!0,a.selectedParentItem=c,b.get(d+"/nka_net3/catalog/get_analytic_depended_item",{params:{id:c,type:a.selectedDependedType,parentType:a.selectedParentId}}).then(function(b){a.dependedCatalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.deleteDependedData=function(c){a.showLoading=!0,b["delete"](d+"/nka_net3/catalog/delete_dependency_data",{params:{idDependency:a.currentDependencyId,idCode:c,idParentCode:a.selectedParentItem}}).then(function(b){a.dependedCatalog=b.data,a.showLoading=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.showListItem=function(c){a.selectedParentItem=c,a.showLoading=!0,b.get(d+"/nka_net3/catalog/get_catalogs_by_type",{params:{type:a.selectedDependedType}}).then(function(b){a.listItems=b.data,a.showLoading=!1,a.showListItems=!0})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})},a.addDependedItem=function(c){a.showLoading=!0,b.post(d+"/nka_net3/catalog/add_dependency_data",{dependencyId:a.currentDependencyId,analyticCode:c,parentAnalyticCode:a.selectedParentItem}).then(function(b){a.dependedCatalog=b.data,a.showLoading=!1,a.showListItems=!1})["catch"](function(){a.showLoading=!1,alert("Ошибка сервера")})}}]),angular.module("assetsApp").controller("TestCtrl",["$scope","$http","$location",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]);