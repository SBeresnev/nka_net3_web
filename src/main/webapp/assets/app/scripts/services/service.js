/**
 * Created by belonovich on 11.02.2015.
 */

'use strict';

angular.module('assetsApp').factory('httpServices', function () {
  var httpServices = {};

  var XMLHttpFactories = [
    function () {
      return new XMLHttpRequest()
    },
    function () {
      return new ActiveXObject("Msxml2.XMLHTTP")
    },
    function () {
      return new ActiveXObject("Msxml3.XMLHTTP")
    },
    function () {
      return new ActiveXObject("Microsoft.XMLHTTP")
    }
  ];

  var createXMLHTTPObject = function () {
    var xmlhttp = false;
    for (var i = 0; i < XMLHttpFactories.length; i++) {
      try {
        xmlhttp = XMLHttpFactories[i]();
      }
      catch (e) {
        continue;
      }
      break;
    }
    return xmlhttp;
  }


  httpServices.updateSubject = function (subject) {
    var url = 'http://localhost:8080/nka_net3/subject/update';
    var params = "?";
    var method = "PUT";
    for (var index in subject) {
      if (index != "bothRegDate" && index != "datestart") {
        params += "" + index + "=" + subject[index] + "&";
      } else {
        if (subject[index] != null) {
          params += "" + index + "=" + subject[index].valueOf() + "&";
        }
      }
    }
    var http = createXMLHTTPObject();
    http.open(method, url + params, true);
    http.send();
  }

  httpServices.searchSubjects = function (id, number, fio, scope) {
    var url = 'http://localhost:8080/nka_net3/subject/private';
    var params = "?" + "type=" + id + "&" + "number=" + number + "&" + "name=" + fio;
    var method = "GET";
    var http = createXMLHTTPObject();
    http.open(method, url + params, true);
    http.send();
    return http.onreadystatechange = function () {
      if (http.readyState == 4) {
        if (http.status == 200) {
          scope.var.subjects = JSON.parse(http.responseText);
          scope.$apply();
        }
      }
    }
  }
  return httpServices;
});
