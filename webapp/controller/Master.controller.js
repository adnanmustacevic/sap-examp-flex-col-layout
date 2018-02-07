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
			this.getValueHelp();
			this.bus = sap.ui.getCore().getEventBus();
		},

		getValueHelp: function() {
			var that = this;
			this.model = {};
		    jQuery.when(ODataServiceUtil.getValueHelpList("Rol")).then(function(rolValueHelp) {
				that.model.rolValueHelp = rolValueHelp;
		        return ODataServiceUtil.getValueHelpList("Gebouw");
		    }).then(function(gebouwValueHelp) {
				that.model.gebouwValueHelp = gebouwValueHelp;
		        return ODataServiceUtil.getValueHelpList("Organisatie");				
		    }).then( function(organisatieValueHelp) {
				that.model.organisatieValueHelp = organisatieValueHelp;	
		    }).fail(function(error) {
				//ShowError
		    });			
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
				that.bus.publish("flexible", "setDetailPage");
				var detailView = sap.ui.getCore().byId("midView");
				detailView.setModel(oODataJSONModel);
			});
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
		},

		getDataFromServiceResultPersons: function(oData, name) {
			var values = this.getDataFromPersonalInfoUpdSet(oData, name);
			var personInfo = {};
			var persons = [];
			values.forEach(function(value) {
				if (value.Fieldvalue) {
					var personalId = value.Fieldvalue.split("|");
					personInfo.profileId = personalId[0].trim();
					personInfo.text = personalId[1].trim();					
				} else {
					personInfo.text = "";
					personInfo.profileId = "";
				}
				persons.push(personInfo);
			});
			if (persons.length === 0) {
				persons.push({
					text:"", 
					profileId:""
				});
			}
			return persons;
		},

		getDataFromServiceResult: function(oData, name, valueHelp) {
			var that = this;
			var values = this.getDataFromPersonalInfoUpdSet(oData, name);
			var fieldValue = [];
			values.forEach(function(value) {
				fieldValue.push(that.getNameById(value.Fieldvalue, valueHelp));
			});
			return fieldValue.join(", ");
		},
		
		getDataFromPersonalInfoUpdSet: function(oData, name) {
			return oData.PersonalInfoSet.results.filter(function(record) {
				return record.Fieldlabel === name;
			});
		},

		getNameById: function(id, valueHelpAttribute) {
			if (valueHelpAttribute) {
				return this.getNameFromValuHelp(id, valueHelpAttribute);
			} else {
				if (id) {
					var name = id.split("|");
					return name[1].trim();					
				}
			}
		},

		getNameFromValuHelp: function (id, valueHelpAttribute) {
			var valueHelp = this.model[valueHelpAttribute];
			var selectedValueHelp = valueHelp.results.filter(function(valueHelpElement){
				return id === valueHelpElement.FieldId;
			});
			if (selectedValueHelp.length > 0) {
				return selectedValueHelp[0].FieldValue;
			} else {
				return "";
			}			
		}
	});
}, true);