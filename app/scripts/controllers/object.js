/**
 * Created by belonovich on 17.02.2015.
 */
angular.module('assetsApp')
    .controller('ObjectCtrl', function ($scope, $http, $location, $filter, httpServices, subjectvar, DOMAIN, WEBDOM) {

        $scope.address = "";
        $scope.address.adr="";
        $scope.type = 2;

        $scope.pars_COATO= "";
        $scope.pars_nblock="";
        $scope.pars_narea="";

        $scope.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];
        /*$scope.var = {
            objecttypes: [
                {id: 1, name: 'Объект'},
                {id: 2, name: 'Право'},
                {id: 3, name: 'Сделка'},
                {id: 4, name: 'ПИК'},
                {id: 5, name: 'Доля права'},
                {id: 6, name: ' Переход права'}
            ],

            typeFormations: [
                {id: 1, name: 'Строение'},
                {id: 2, name: 'Участок'},
                {id: 3, name: 'Часть строения'}
            ],

            typeRights:[
                {id: 1, name: 'Собственность'},
                {id: 2, name: 'Пожизненное наследуемое владение'},
                {id: 3, name: 'Постоянное пользование'},
                {id: 4, name: 'Временное пользование'},
                {id: 5, name: 'Хозяйственное ведение'},
                {id: 6, name: 'Оперативное управление'},
                {id: 7, name: 'Сервитут'},
                {id: 8, name: 'Доверительное управление'},
                {id: 9, name: 'Рента'},
                {id: 10, name: 'Залог'},
                {id: 11, name: 'Аренда'},
                {id: 12, name: 'Безвозмездное пользование'},
                {id: 13, name: 'Ограничения (обременения) прав в использовании земель'},
                {id: 14, name: 'Ограничения (обременения) прав, установленные законодательством'},
                {id: 15, name: 'Ограничения (обременения) прав, установленные уполномоченными органами'}
            ],

            typeBargains:[
                {id: 1, name: 'Адресная продажа'},
                {id: 2, name: 'Аукцион'}
            ],

            message: {
                title : '',
                html: ''
            }
        };*/

        $scope.var = {
            loading: false,
            states: '',
            items: '',
            obj: '',
            subjects: [{label: 'loading'}],
            subj: []
        };

        $('ul.nav li').click(function(e) {

            var $this = $(this);

            $('ul.nav').find('a.active').last().removeClass('active')

            $this.find('a').addClass('active');
        });

        $scope.getSubStrCadastr = function(subject, from, to){
            if(subject != null)
                return subject.cadastre_number.substring(from,to);
            return "";
        };

        $scope.showModalDoc = false;
        $scope.showModalObject = false;

        $scope.modalDoc = function () {
            $scope.showModalDoc = !$scope.showModalDoc;
        };

        $scope.modalObject = function (modid) {
           /* $scope.showModalObject = !$scope.showModalObject;*/

            var myElement = angular.element(document.querySelector(modid));

            myElement.modal("show");
        };

        $scope.urlAddress = WEBDOM + '//#/address';
        //window.location.protocol + '//'+ window.location.hostname+":9000" + '/#/address';

        $scope.openAddress = function () {
            sessionStorage.setItem("addObj",JSON.stringify([]));
            $scope.DlgOptions = {
                width: "1300px", height: "500px", modal: true,
                actions: ["Custom", "Minimize", "Maximize", "Close"],
                title: "Addresses", iframe: true, visible: false
            };

            $scope.window.element.children(".k-content-frame").contents().find(".header")[0].style.display="none";

            $scope.window.setOptions($scope.DlgOptions);

            $scope.window.center();  // open dailog in center of screen

            $scope.window.open();

        }

        $scope.closeAddress = function() {

            //$scope.address = JSON.parse(sessionStorage.getItem("addressObj"));
           // $scope.address.adr = $scope.address == null ? $scope.address : $scope.address.adr;

            if(($scope.address = JSON.parse(sessionStorage.getItem("addressObj"))) == null){
                $scope.address=[adr=""];
            }

        }

        $scope.printObject = function(el) {
            var innerContents = document.getElementById(el).innerHTML;
            var doc = '<html><head><link rel="stylesheet" type="text/css" /></head><body onload="window.print()">' + innerContents + '</html>';
            var win = window.open();
            win.document.write(doc);
            win.document.close();
            win.close();
        }

        $scope.searchAdress = function () {

            $scope.var.loading = true;
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchObjectsByAdress($scope.address.address_id, $scope);
        };

        $scope.findByCadastr = function(coato, block, area) {
            return !(coato*block*area);
        };

        $scope.searchCadastr = function(coato, block, area) {
            $scope.var.loading = true;
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            var cadastr = coato+block+area;
            httpServices.searchObjectsByCadastr(cadastr, $scope);
        };


        $scope.searchInv = function(inv, code) {
            $scope.var.loading = true;
            $scope.var.subjects = [];
            delete $http.defaults.headers.common['X-Requested-With'];
            httpServices.searchObjectsByInv(inv, $scope.type, code, $scope);
        };

        $scope.settype = function(type) {
           $scope.type = type;
        };

        $scope.updateObjectForm = function (subject) {

            if(subject.address_dest==null)
                subject.address_dest = angular.copy($scope.address);

            $scope.formShow=true;
            $scope.strTabShow = false;

            $scope.subjectForm=angular.copy(subject);

             //   subject = $scope.createJSON(subject);

            var cad = subject.cadastre_number;
            if(cad!=null && cad !="")
            {
                $scope.pars_COATO= cad.substring(0,10);
                $scope.pars_nblock= cad.substring(10, 12);
                $scope.pars_narea=cad.substring(12, 18);

            }

                $scope.var.subjtype = subject.subjectType;

                $scope.var.subj = angular.copy(subject);

            $scope.var.obj = $scope.isNull($scope.var.subj.cadastre_number) + $scope.isNull($scope.var.subj.org_id,$scope.var.subj.objectType.v_prm1,$scope.var.subj.inventory_number) + $scope.isNull($scope.var.subj.objectType.code_name);
        };

        $scope.isNull = function() {
            var str="";
            var i = 0, count = arguments.length;
            if(count>0)
                for(i=0;i<count;i++){
                    if(arguments[i]==null)
                        return "";
                    str += arguments[i];
                }
            return str+"; ";
        };

        $scope.bind = function() {
            var myElement = angular.element(document.querySelector('#ObjectID'));

            console.log(JSON.stringify($scope.var.subj));

            myElement.addClass("wait");
            $scope.var.subj.status = 1;

            $http.post(DOMAIN + "/nka_net3/object/bindObject?", $scope.var.subj ).success(function (data, status, headers) {

                $scope.var.subj = data;

                sessionStorage.setItem("addObj",JSON.stringify($scope.var.toSend));

                swal("Good job!", "Object ID = " + $scope.var.subj.obj_id , "success");

                myElement.removeClass("wait");

            }).error(function (data, status, header, config) {

                $scope.ServerResponse = 'Error message: '+data + "\n\n\n\nstatus: " + status + "\n\n\n\nheaders: " + header + "\n\n\n\nconfig: " + config;

                swal("Error", $scope.ServerResponse , "error");


            });

        };
    });
