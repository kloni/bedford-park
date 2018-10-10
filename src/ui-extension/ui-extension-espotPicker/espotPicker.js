var app = angular.module('app', [
    'ui.bootstrap',
    'eSpotPicker',
    'pascalprecht.translate'
]);

angular.module('eSpotPicker', [ 'ui.bootstrap', 'pascalprecht.translate'])

.config(['$translateProvider', function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: './nls/',
        suffix: '.json'
    });
}])

.factory('eSpotTypeConstants', [ function() {
    return {
        'COMMON': {
            key: 'common',
            text: 'Common E-Marketing Spot'
        },
        'SUFFIX': {
            key: 'page-suffix',
            text: 'Page-specific E-Marketing spot using suffix'
        },
        'PREFIX': {
            key: 'page-prefix',
            text: 'Page-specific E-Marketing spot using prefix'
        }
    };
}])

.factory('eSpotPickerService', [
    '$q',
    '$http',
    function($q, $http) {
        var DEFAULT_SITE_ID  = "default";
        var service = {};

        service.sendRequest = function(url, options) {
            var q = $q.defer();
            if (options === undefined) {
                options = {
                    method: 'GET',
                    url: url
                };
            };

            $http(options)
            .then(function(response) {
                q.resolve(response.data);
            })
            .catch(function(error){
                q.reject(error);
            });
            return q.promise;
        };

        service.getCurrentTenant = function(){
            var url = service.apiUrl + 'registry/v1/currenttenant';
            return service.sendRequest(url);
        };

        service.getStoreName = function(siteId) {
            var url = service.apiUrl + '/delivery/v1/rendering/sites/' + siteId;
            return service.sendRequest(url)
            .then(function(response){
                service.storeIdentifier = response.storeIdentifier;
                return response.storeIdentifier;
            });
        }

        service.getStoreId = function(){
            // check if storeIdentifier already exists;
            var storeNamePromise = service.storeIdentifier === undefined ? service.getStoreName(DEFAULT_SITE_ID) : $q.when(service.storeIdentifier);

            return storeNamePromise
            .then(function(storeName) {
                var url = service.commerceTransactionHost + '/wcs/resources/store/0/adminLookup?q=findByStoreIdentifier&storeIdentifier=' + storeName;

                return service.sendRequest(url)
                .then(function(response){
                    if (response && response.resultList && response.resultList[0]) {
                        service.storeId = response.resultList[0].storeId;
                        return response.resultList[0].storeId;
                    }
                    return null;
                })
            });
        }

        service.getESpotByName = function(name) {
          var eSpotDesc = !!name ? `byTypeAndName&qName=${name}` : "byType";
          var suffix = `/wcs/resources/store/${service.storeId}/spot?qType=MARKETING&q=${eSpotDesc}`;
          var deferred = $q.defer();

          $q.all([service.getSSOToken(), service.getCurrentTenant()])
          .then(function(responses) {
            var sso = responses[0][0].sso_idc;
            var ic = responses[1].ibmCommerce;

            if (!!ic) {
              var url = service.getJWTURI(ic, suffix);
              var options = {
                method: "GET",
                url: url,
                headers: { ["authorization"]: `Bearer ${sso}` }
              }

              service.sendRequest(url, options)
              .then(function(response) { deferred.resolve(response.MarketingSpot); })
              .catch(function(error) { deferred.reject(error); })
            } else {
              deferred.reject("ibmCommerce attribute not found in currenttenant endpoint");
            }
          });

          return deferred.promise;
        }

        service.getSSOToken = function() {
          var url = service.apiUrl + '/security/v1/consumer/idc';
          var options = {
            method: "POST",
            url: url,
            headers: { ["Content-type"]: "application/json; charset=UTF-8" },
            withCredentials: true
          }
          return service.sendRequest(url, options)
        }

        service.getJWTURI = function(commerce, restArgs, isSearch = false) {
          var tId = commerce.tenantId;
          var eId = commerce.environmentId;
          var params = commerce.apiGatewayParameters;
          var host = commerce.apiGatewayHost;
          var ctx = isSearch ? commerce.apiGatewaySearchContextRoot : commerce.apiGatewaySearchContextRoot.replace("search","ts");
          return `${host}${ctx}${restArgs}&ctxOrgId=${tId}&environmentId=${eId}&environmentInstance=auth&${params}`;
        }

        return service;
    }
])

.controller ('eSpotPickerController', [
    '$scope',
    '$window',
    '$timeout',
    '$translate',
    'eSpotTypeConstants',
    'eSpotPickerService',
    function($scope, $window, $timeout, $translate, eSpotTypeConstants, eSpotPickerService) {
        var ctrl = this;

        var KEY_TYPE = 'type';
        var KEY_SELECTION = 'selection';

        ctrl.commerceTransactionHost = '';
        ctrl.selectedEspotNames = [];
        ctrl.allowMultipleNames = true;
        ctrl.showDropdownList = {
            'type': false,
            'name': false
        };
        var types = [
            eSpotTypeConstants.COMMON,
            eSpotTypeConstants.SUFFIX,
            eSpotTypeConstants.PREFIX
        ];
        ctrl.espotTypes = types;

        ctrl.setFocus = function(dropdownType){
          var id='espot_'+dropdownType+'_dropdown';
          var obj=$window.document.getElementById(id);
          ctrl.showDropdownList[dropdownType] = true;
          obj.focus();
          wchUIExt.requestResizeFrame(550);
        }

        ctrl.removeFocus = function(dropdownType){
            $timeout(function() {
                if (!ctrl.onSelect) {
                    ctrl.onSelect = false;
                }
                ctrl.showDropdownList[dropdownType] = false;
                var windowSize = ctrl.selectedEspotNames.length > 6 ? ctrl.selectedEspotNames * 35 : 400;
                wchUIExt.requestResizeFrame(windowSize);
            }, 200);
        }

        ctrl.resizeFrameWindow = function(){
            var windowSize = ctrl.selectedEspotNames.length > 6 ? ctrl.selectedEspotNames.length * 35 : 400;
            wchUIExt.requestResizeFrame(windowSize);
        }

        ctrl.deregisterWatch = $scope.$watch('ctrl.typedEspot', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal && newVal.length > 3) {
                ctrl.getESpotByName(newVal)
                .then(function (espot) {
                    ctrl.espots = espot;
                });
            } else if (newVal === '') {
                ctrl.espots = ctrl.allEspots;
            }
        });

        $scope.$watch('ctrl.typedEspotType', function(newVal, oldVal) {
            if (newVal !== oldVal && newVal && newVal.length !== 0) {
                ctrl.espotTypes = types.filter(type => type.text.toLowerCase().includes(newVal.toLowerCase()));
            } else if (newVal === "") {
                ctrl.espotTypes = types;
            }
        });

        ctrl.onRemoveEspot = function(espot) {
            ctrl.selectedEspotNames.splice(ctrl.selectedEspotNames.indexOf(espot), 1);
            if (ctrl.selectedEspotNames.length !== 0) {
                var valueToSave = ctrl.allowMultipleNames ? ctrl.selectedEspotNames : ctrl.selectedEspotNames[0];
                ctrl.updateSelectedValues(ctrl.selectedType.key, valueToSave);
            }
        };

        ctrl.onRemoveType = function() {
            ctrl.selectedType = '';
        };

        ctrl.onSelectEspot = function(espot){
            ctrl.onSelect = true;

            if (!ctrl.allowMultipleNames || (ctrl.allowMultipleNames && !ctrl.selectedEspotNames)) {
                // only single name allowed, or none selected before
                ctrl.selectedEspotNames = [espot.spotName];
            }
            else if (ctrl.selectedEspotNames.indexOf(espot.spotName) === -1){
                // multiple names are allowed
                ctrl.selectedEspotNames.push(espot.spotName);
            };
            var valueToSave = ctrl.allowMultipleNames ? ctrl.selectedEspotNames : ctrl.selectedEspotNames[0];
            ctrl.updateSelectedValues(ctrl.selectedType.key, valueToSave);
            ctrl.showDropdownList.name = false;
        }

        ctrl.onSelectType = function(type){
            ctrl.onSelect = true;
            ctrl.selectedType = type;
            ctrl.updateSelectedValues(ctrl.selectedType.key, undefined);
            ctrl.showDropdownList.type = false;
        };

        ctrl.showEspotNameInputField = function(){
            return ctrl.selectedType === undefined ? false : ctrl.selectedType.key === eSpotTypeConstants.PREFIX.key || ctrl.selectedType.key === eSpotTypeConstants.SUFFIX.key;
        };

        ctrl.showEspotNameDropdown = function(){
            return ctrl.selectedType === eSpotTypeConstants.COMMON;
        };

        ctrl.saveInput = function(){
            if (ctrl.espotName !== '') {
                var names = ctrl.allowMultipleNames ? [ ctrl.espotName ] : ctrl.espotName;
                ctrl.updateSelectedValues(ctrl.selectedType.key, names);
            }
        };

        ctrl.toggleDropdown = function(type){
          var newState=!ctrl.showDropdownList[type];
          ctrl.showDropdownList[type] = newState;
          if (newState) {
            ctrl.setFocus(type);
          }
        };

        ctrl.updateSelectedValues = function(type, names){
            // save value with right key
            var selectedValues = {};
            var selectedValueObject = {};
            selectedValues[ KEY_TYPE ] = type;
            selectedValues[ KEY_SELECTION ] = names;
            wchUIExt.getDefinition().then((definition) => {
                if (definition.elementType === "group") {
                    definition.elements.forEach( value => {
                        if (!!selectedValues[value.key]) {
                            selectedValueObject[value.key] = ctrl.setElementValues(value, selectedValues[value.key]);
                        };
                    });
                    wchUIExt.setElement({
                        elementType: "group",
                        typeRef: definition.typeRef,
                        value: selectedValueObject
                    });
                };
            });
        };

        ctrl.setElementValues = function(element, value) {
            var result = {};
            result.elementType = element.elementType;
            if (element.allowMultipleValues) {
                result.values = value;
            } else {
                result.value = value;
            };
            return result;
        }

        ctrl.onInit = function() {
            wchUIExt.requestResizeFrame(400);

            // get configurations needed for calling espots
            wchUIExt.getTenantConfig().then(config => {
                eSpotPickerService.apiUrl = config.apiUrl;
                eSpotPickerService.getCurrentTenant().then( tenantInfo => {
                    eSpotPickerService.commerceTransactionHost = tenantInfo.ibmCommerce.liveTransactionHost;
                    eSpotPickerService.getStoreId()
                    .then(function(store){
                        eSpotPickerService.getESpotByName()
                        .then(function(response){
                            ctrl.espots = response;
                            ctrl.allEspots = response;
                        })
                    });
                });
            });

            wchUIExt.getDefinition().then((definition) => {
                ctrl.isPublished = definition.disabled;
                definition.elements.forEach( element => {
                    if (element.key === KEY_SELECTION) {
                        ctrl.allowMultipleNames = element.allowMultipleValues;
                    };
                });
            });

            wchUIExt.getElements()
            .then((element) => {
                if (ctrl.selectionIsDefined(element, KEY_TYPE)) {
                    ctrl.selectedType = getEspotTypeByKey(element.value[KEY_TYPE].value);
                    if (ctrl.selectionIsDefined(element) && ctrl.showEspotNameDropdown()) {
                        ctrl.selectedEspotNames =  element.value[KEY_SELECTION].values ? element.value[KEY_SELECTION].values : [element.value[KEY_SELECTION].value];
                    }
                    else if (selectionIsDefined(element) && ctrl.showEspotNameInputField()) {
                        ctrl.espotName = element.value[KEY_SELECTION].values ? element.value[KEY_SELECTION].values[0] : element.value[KEY_SELECTION].value;
                    }
                }
                ctrl.resizeFrameWindow();
            });

            wchUIExt.getCurrentLocale().then(contentMetadata => {
                $translate.use(contentMetadata);
            });
        };

        ctrl.selectionIsDefined = function(element, k=null){
            return element && element.value && element.value[k?k:KEY_SELECTION];
        }

        ctrl.getEspotTypeByKey = function(typeKey) {
            for (var i = 0; i < ctrl.espotTypes.length; i++) {
                if (ctrl.espotTypes[i].key === typeKey) {
                    return ctrl.espotTypes[i];
                }
            }
            return "";
        }

        // dynamically load the UI SDK depending on where we reside
        var hostnameParts = window.location.hostname.split(".");
        var proto = window.location.protocol;
        var host;

        if (hostnameParts[0].search(/\bstage$/) != -1) {
          hostnameParts[0] = "www-stage";
        } else if (hostnameParts[0].search(/\bdxcloud$/) != -1) {
          hostnameParts[0] = "dxcloud";
        } else {
          hostnameParts[0] = "www";
        }
        host = hostnameParts.join(".");

        var script = document.createElement("script")
        script.type = "text/javascript";

        if (script.readyState) {
          script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
              script.onreadystatechange = null;
              ctrl.onInit();
            }
          };
        } else {
          script.onload = function() {
            ctrl.onInit();
          };
        }

        script.src = proto + "//" + host + "/auth/ibm-wch-ui-extensions.js";
        document.getElementsByTagName("head")[0].appendChild(script);
    }
]);
