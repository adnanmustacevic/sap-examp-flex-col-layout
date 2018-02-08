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
			manifest: "json",
			includes: [
				"css/style.css"
			],			
			rootView: "nl.kadaster.test.flexcollayout.mycolleagues.view.App",
			dependencies: {
				libs: [
					"sap.m",
					"sap.f"
				]
			},
			config : {
			  "resourceBundle" : "i18n/i18n.properties"
			}
		}
	});
	return Component;
}, true);