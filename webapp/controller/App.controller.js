sap.ui.define([
        "sap/ui/core/mvc/Controller"
    ], function (Controller) {
        "use strict";
        return Controller.extend("nl.kadaster.test.flexcollayout.mycolleagues.controller.App", {
	    onInit: function () {
	        var flexibleColumnLayout = sap.ui.xmlview("FlexibleColumnLayout", "nl.kadaster.test.flexcollayout.mycolleagues.view.FlexibleColumnLayout");
	        flexibleColumnLayout.getController().nav = this;
	        this.getView().app = this.getView().byId("idAppControl").addPage(flexibleColumnLayout, true);
	        this.getView().app.addPage(flexibleColumnLayout, true);
	    },
	
	    /**
	     * Navigates to another page
	     * @param {string} pageId The id of the next page
	     * @param {sap.ui.model.Context} context The data context to be applied to the next page (optional)
	     */
	    to : function (pageId){
	        var app = this.getView().app;
	        app.to(pageId);
	    },
	
	    createPage: function(pageId, context){
	        // load page on demand
	        var app = this.getView().app;
	        var master = (pageId === "Main");
	        var page = app.getPage(pageId, master);
	        if (page  === null) {
	            page = sap.ui.view({
	                id : pageId,
	                viewName : "nl.kadaster.fiori.demo.evenementen.view." + pageId,
	                type : "XML"
	            });
	            page.getController().nav = this;
	            app.addPage(page, master);
	        } else {
	            page = sap.ui.getCore().byId(pageId);
	        }
	        if (context) {
	            page.setBindingContext(context);
	        }
	        return page;
	    },
	
	    // toFirst : function (pageId) {
	    //     var app = this.getView().app;
	    //     app.to(pageId);
	    //     var oListControl = sap.ui.getCore().byId("Master").byId("list");
	    //     oListControl.setSelectedItemById(oListControl.getItems()[0].sId);
	    // },
	
	    /**
	     * Navigates back to a previous page
	     * @param {string} pageId The id of the next page
	     */
	    back : function (pageId) {
	        this.getView().app.backToPage(pageId);
	    }
        });

    }
);