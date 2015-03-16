/**
@author Stamplay
@version 1.0
@description an awesome javascript sdk for Stamplay 
*/
/* Initizialize library */
(function (root) {

	/*  Inizialization of Stamplay Object */
	root.Stamplay = root.Stamplay || {};
	/* setting attribute API Version */
	root.Stamplay.VERSION = "v0";
	/* Silence Q logging */
	Q.stopUnhandledRejectionTracking();
	/* appId */
	root.Stamplay.APPID = ""
	/* baseUrl */
	root.Stamplay.BASEURL = "";
	/*  check if exist local storage with the support of store.js */
	if(window.localStorage && store.enabled){
   root.Stamplay.USESTORAGE = true;
	}
	/* init method for setup the base url */
	root.Stamplay.init = function(appId){
		root.Stamplay.BASEURL = 'https://'+appId+'.stamplayapp.com';
		root.Stamplay.APPID   = appId;
	}
	
}(this));
