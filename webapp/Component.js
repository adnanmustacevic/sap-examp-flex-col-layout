jQuery.sap.declare("nl.kadaster.test.flexcollayout.mycolleagues.Component");
sap.ui.getCore().loadLibrary("sap.ui.generic.app");
jQuery.sap.require("sap.ui.generic.app.AppComponent");

sap.ui.generic.app.AppComponent.extend("nl.kadaster.test.flexcollayout.mycolleagues.Component", {
	metadata: {
		"manifest": "json"
	}
});

sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/m/routing/Router"
], function (UIComponent, Router) {
	"use strict";

	var Component = UIComponent.extend("nl.kadaster.test.flexcollayout.mycolleagues.Component", {
		metadata: {
			rootView: "nl.kadaster.test.flexcollayout.mycolleagues.view.App",
			dependencies: {
				libs: [
					"sap.m",
					"sap.f"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"Component.js",
						"controller/App.controller.js",		
						"view/App.view.xml",							
						"controller/FlexibleColumnLayout.controller.js",
						"view/FlexibleColumnLayout.view.xml",
						"controller/Master.controller.js",
						"view/Master.view.xml",
						"controller/Detail.controller.js",
						"view/Detail.view.xml",
						"view/DetailDetail.view.xml",
						"util/ODataServiceUtil.js",
						"util/DetailDetail.Util.js"
					]
				}
			}
		}
	});
	return Component;
}, true);