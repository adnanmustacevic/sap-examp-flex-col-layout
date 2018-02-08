sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"nl/kadaster/test/flexcollayout/mycolleagues/util/Util",
	"nl/kadaster/test/flexcollayout/mycolleagues/util/ODataServiceUtil"	
], function (Controller, MessageToast, Util, ODataServiceUtil) {
	"use strict";

	return Controller.extend("nl.kadaster.test.flexcollayout.mycolleagues.controller.Detail", {
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
		},

		onLinkClick: function(oEvent) {
			var that = this;
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();	
			var bindingContext = oEvent.getSource().getBindingContext();
			var persNo = bindingContext.getModel().getObject(bindingContext.getPath()).profileId;
			
		    jQuery.when(ODataServiceUtil.getEmployeeData(persNo)).then(function(persInfo) {
				persInfo.photoURL = "/sap/opu/odata/sap/ZHCM_EMPLOYEE_LOOKUP_SRV/EmployeeInfoSet('" + persNo + "')/$value";
				persInfo.contactgegevens = resourceBundle.getText("CONTACT_DATA").trim();
				persInfo.doorkiesnummer = resourceBundle.getText("DOORKIESNUMMER_PERGEG_DISP").trim();
				persInfo.mobielnummer = resourceBundle.getText("MOBIEL_PERGEG_DISP").trim();
				persInfo.email = resourceBundle.getText("EMAIL_PERGEG_DISP").trim();
				persInfo.kamernummer = resourceBundle.getText("KAMERNUMMER_ORGGEG_DISP").trim();
				persInfo.Mobiel = persInfo.Mobiel ? Util.formatMobielNummer(persInfo.Mobiel, 2) : "";
				persInfo.Email = persInfo.Email ? persInfo.Email.toLowerCase() : "";
				that.bus.publish("flexible", "setDetailDetailPage");				
				var endView = sap.ui.getCore().byId("endView");
				endView.setModel(new sap.ui.model.json.JSONModel(persInfo));

		    }).fail(function() {
				//ShowError
		    });
		}
		
	});
}, true);