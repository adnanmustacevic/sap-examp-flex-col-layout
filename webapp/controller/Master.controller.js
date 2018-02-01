sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"nl/kadaster/test/flexcollayout/mycolleagues/util/Util",
	"nl/kadaster/test/flexcollayout/mycolleagues/util/ODataServiceUtil"
], function (Controller, MessageToast, JSONModel, Util, ODataServiceUtil) {
	"use strict";

	return Controller.extend("nl.kadaster.test.flexcollayout.mycolleagues.controller.Master", {
		onInit: function () {
			this.bus = sap.ui.getCore().getEventBus();
		},
		handleRowSellect: function (evt) {
			var that = this;
			var contextSource = evt.getSource();
			var bindingContext = contextSource.getBindingContext();
			var selectedEmployee = bindingContext.getModel().getObject(bindingContext.getPath());


			// var detailView = that.nav.createPage("Detail");//No context from master page is needed because the detailed data is retrieved from the server again.
//			var detailView = FlexibleColumnLayout.setDetailPage();                         
			// var path = context.getPath().replace("/results/", "");
			// var selectedEmployee = this.getView().getModel().getData().results[path];
			var imageURL = selectedEmployee.photoURL;			
			
			jQuery.when(ODataServiceUtil.getEmployeeData(selectedEmployee.EmployeeNumber)).then(function(oData) {
				var oODataJSONModel = new sap.ui.model.json.JSONModel();
				oData.roles = that.getDataFromServiceResult(oData, "Rol", "rolValueHelp");
				oData.secretariaatVan = that.getDataFromServiceResult(oData, "SecretariaatVan", "organisatieValueHelp");
				oData.secretariaat = that.getDataFromServiceResult(oData, "Secretariaat");
				oData.manager = that.getDataFromServiceResult(oData, "Manager");	
				oData.linkItemsManager = that.getDataFromServiceResultPersons(oData, "Manager");
				oData.linkItemsSecretariaat = that.getDataFromServiceResultPersons(oData, "Secretariaat");
				var uiDataModel = oData;
				uiDataModel.Mobiel = Util.formatMobielNummer(uiDataModel.Mobiel, 2);
				uiDataModel.Email = uiDataModel.Email ? uiDataModel.Email.toLowerCase() : "";
				uiDataModel.PhotoUrl = imageURL;    
				uiDataModel.GebouwNaam = that.getNameById(oData.Gebouw, "gebouwValueHelp");
				oODataJSONModel.setData(uiDataModel);
//				detailView.setModel(oODataJSONModel);
//				detailView.getModel().refresh();
				that.nav.to("Detail", context);
			}); 	
			
			this.bus.publish("flexible", "setDetailPage");
		},
	
		handleSearch: function() {
/*			if (!this.getModel("device").getData().isPhone) {
				this.clearDetail();	
			}
*/
			var that = this;
			var searchString = this.getView().byId("employeesSearch").getValue();
		
			jQuery.when(ODataServiceUtil.getSearchResult(searchString)).then(function(oData) {
				oData.results.forEach(function (element) {
					element.OfficeEmail  = element.OfficeEmail ? element.OfficeEmail.toLowerCase() : "";
					element.photoURL = "/sap/opu/odata/sap/HCM_EMPLOYEE_LOOKUP_SRV/EmployeeInfoSet('" + element.EmployeeNumber + "')/$value";
				});
				that.getView().setModel(new sap.ui.model.json.JSONModel(oData));
			});  
		}
	});
}, true);