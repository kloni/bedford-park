var app = angular.module('app', [
    'ui.bootstrap',
    'physicalStorePicker'
]);

angular.module('physicalStorePicker', [ 'ui.bootstrap'])

.factory('physicalStorePickerService', [
    '$q',
    '$http',
    function($q, $http) {
        var service = {};

        var sendRequest = function(url, options){
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
                if (url.startsWith(service.commerceTransactionHost + "/wcs/resources/store/" + service.storeId + "/storelocator/byLocation?country=")) {
                    q.resolve([]);
                }
                else {
                    q.reject(error);
                }
            });
            return q.promise;
        };

        service.getCurrentTenant = function(){
            var url = service.apiUrl + 'registry/v1/currenttenant';
            return sendRequest(url);
        };

        service.getStoreName = function() {
            var url = service.apiUrl + '/delivery/v1/rendering/sites/default';
            return sendRequest(url)
            .then(function(response){
                service.storeIdentifier = response.storeIdentifier;
                return response.storeIdentifier;
            });
        }

        service.getStoreId = function(){
            // check if storeIdentifier already exists;
            var storeNamePromise = service.storeIdentifier === undefined?
                service.getStoreName() : $q.when(service.storeIdentifier);

            return storeNamePromise
            .then(function(storeName){
                var url = service.commerceTransactionHost + '/wcs/resources/store/0/adminLookup?q=findByStoreIdentifier&storeIdentifier=' + storeName;

                return sendRequest(url)
                .then(function(response){
                    if (response && response.resultList && response.resultList[0]) {
                        service.storeId = response.resultList[0].storeId;
                        return response.resultList[0].storeId;
                    }
                    return null;
                })
            });
        }

        service.getAllSupportedCountries = function(){
            var url = service.commerceTransactionHost + "/wcs/resources/store/" + service.storeId + "/configuration/com.ibm.commerce.foundation.country"

            return sendRequest(url)
            .then(function(response){
                if (response && response.resultList && response.resultList[0] && response.resultList[0].configurationAttribute && response.resultList[0].configurationAttribute[0]) {
                    return response.resultList[0].configurationAttribute
                    .reduce(function (prev, data) {
                        return prev.concat(data.additionalValue[0].value);
                    }, []);
                }
                return null;
            });
        }

        service.getPhysicalStoreLocation = function(countryName){
            var url = service.commerceTransactionHost + "/wcs/resources/store/" + service.storeId + "/storelocator/byLocation?country=" + countryName + "&siteLevelStoreSearch=false"

            return sendRequest(url)
            .then(function(response){
                if (response && response.dataList && response.dataList[0]) {
                    return response.dataList
                    .filter(function(data) {
                        return data.PhysicalStore;
                    })
                    .reduce(function (prev, data) {
                        return prev.concat(data.PhysicalStore);
                    }, []);
                }
                return [];
            });
        }

        return service;
    }
])

.controller ('physicalStorePickerController', [
    '$scope',
    '$timeout',
    'physicalStorePickerService',
    function($scope, $timeout, physicalStorePickerService) {
        var ctrl = this;

        const KEY_PHYSICAL_STORE_NAME = 'physicalStoreName';
        const KEY_PHYSICAL_STORE_ID = 'physicalStoreId';

        ctrl.commerceTransactionHost = '';
        ctrl.showPhysicalStoreDropdown = false;

        ctrl.setFocus = function(){
            ctrl.showPhysicalStoreDropdown = true;
            wchUIExt.requestResizeFrame(250);
        }

        ctrl.removeFocus = function(){
            $timeout(function() {
                ctrl.showPhysicalStoreDropdown = false;
                ctrl.resizeFrameWindow();
            }, 200);
        }

        ctrl.resizeFrameWindow = function(){
            var windowSize = ctrl.selectedPhysicalStore.length > 0 && !ctrl.isPublished ? 80 : 40;
            wchUIExt.requestResizeFrame(windowSize);
        }

        ctrl.onRemovePhysicalStore = function(physicalStore) {
            ctrl.selectedPhysicalStore = null;
        };

        ctrl.onSelectPhysicalStore = function(physicalStore){
            ctrl.selectedPhysicalStore = physicalStore.storeName;
            ctrl.updateSelectedValue(physicalStore);
            ctrl.showPhysicalStoreDropdown = false;
            ctrl.resizeFrameWindow();
        }

        ctrl.updateSelectedValue = function(physicalStore){
            var selectedValue = {};
            var selectedValueObject = {};
            selectedValue[ KEY_PHYSICAL_STORE_NAME ] = physicalStore.storeName;
            selectedValue[ KEY_PHYSICAL_STORE_ID ] = physicalStore.uniqueID;
            wchUIExt.getDefinition().then((definition) => {
                if (definition.elementType === "group") {
                    definition.elements.forEach( value => {
                        if (!!selectedValue[value.key]) {
                            selectedValueObject[value.key] = setElementValues(value, selectedValue[value.key]);
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

        setElementValues = function(element, value) {
            var result = {};
            result.elementType = element.elementType;
            result.value = value;
            return result;
        }

        ctrl.toggleDropdown = function(){
            ctrl.showPhysicalStoreDropdown = !ctrl.showPhysicalStoreDropdown;
            if (ctrl.showPhysicalStoreDropdown) {
                wchUIExt.requestResizeFrame(250);
            }
            else {
                ctrl.resizeFrameWindow();
            }
        };

        ctrl.onInit = function() {
            wchUIExt.requestResizeFrame(40);

            // get configurations needed for calling physical store locations
            wchUIExt.getTenantConfig().then(config => {
                physicalStorePickerService.apiUrl = config.apiUrl;
                physicalStorePickerService.getCurrentTenant().then( tenantInfo => {
                    physicalStorePickerService.commerceTransactionHost = tenantInfo.ibmCommerce.liveTransactionHost;
                    physicalStorePickerService.getStoreId()
                    .then(function(store){
                        physicalStorePickerService.getAllSupportedCountries()
                        .then(function(countries){
                            ctrl.physicalStores = [];
                            countries.forEach(countryName => {
                                physicalStorePickerService.getPhysicalStoreLocation(countryName)
                                .then(function(response){
                                    ctrl.physicalStores = ctrl.physicalStores.concat(response).sort(
                                        function(a, b) {
                                            return a.storeName.localeCompare(b.storeName);
                                        }
                                    );
                                });
                            });
                        });
                    });
                });
            });

            wchUIExt.getDefinition().then((definition) => {
                ctrl.isPublished = definition.disabled;
            });

            wchUIExt.getElements()
            .then((element) => {
                if (element && element.value[KEY_PHYSICAL_STORE_NAME]) {
                    ctrl.selectedPhysicalStore = element.value[KEY_PHYSICAL_STORE_NAME].value;
                }
                ctrl.resizeFrameWindow();
            });
        };

        ctrl.onInit();
    }
]);