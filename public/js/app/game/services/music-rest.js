'use strict';


angular.module('ds.game')
        .factory('MusicREST', ['Restangular', 'SiteConfigSvc', 'CookieSvc', function (Restangular, siteConfig, CookieSvc) {

                var getConsentReference = function () {
                    var consentReferenceCookie = CookieSvc.getConsentReferenceCookie();
                    if (!!consentReferenceCookie) {
                        return consentReferenceCookie;
                    } else {
                        return '';
                    }
                };

                return {
                    /** Configures main orders API endpoint.*/
                    Music: Restangular.withConfig(function (RestangularConfigurer) {
                        RestangularConfigurer.setBaseUrl(siteConfig.apis.music.baseUrl);
                        RestangularConfigurer.setDefaultHeaders({"consent-reference": getConsentReference()});
                    })
                };


            }]);