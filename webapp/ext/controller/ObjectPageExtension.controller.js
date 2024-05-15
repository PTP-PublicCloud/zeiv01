sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/ui/core/Fragment", 
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/m/MessageBox"
], function (Controller, Fragment, JSONModel, Filter, MessageBox) {
    return {
        onInit: function() {
            Fragment.load({
                id: "zeinvhddt",
                name: "zeinvhddt.ext.fragment.Busy",
                type: "XML",
                controller: this
            })
            .then((oDialog) => {
                this.zeinvhddtBusyDialogObject = oDialog;
            })
            .catch(error => {
                MessageBox.error('Vui lòng tải lại trang')
            });

            Fragment.load({
                id: "zeinvhddt",
                name: "zeinvhddt.ext.fragment.XMLView",
                type: "XML",
                controller: this
            })
            .then((oDialog) => {
                this.zeinvhddtXMLView = oDialog;
            })
            .catch(error => {
                MessageBox.error('Vui lòng tải lại trang')
            });
        },
        onBeforeRebindTableExtension: function(oSource){
        },
        onAfterRendering: function(oEvent) {
            var draftButton = this.byId('zeinvhddt::sap.suite.ui.generic.template.ObjectPage.view.Details::ZEINV_I_HOADON--action::actionDraftObject')
            draftButton.bindProperty("visible", {
                path: "VisibilityPublishAction"
            });

            var reviewButton = this.byId('zeinvhddt::sap.suite.ui.generic.template.ObjectPage.view.Details::ZEINV_I_HOADON--action::actionReviewXML')
            reviewButton.bindProperty("visible", {
                path: "VisibilityPublishAction"
            });

            var displatButton = this.byId('zeinvhddt::sap.suite.ui.generic.template.ObjectPage.view.Details::ZEINV_I_HOADON--action::actionDownloadPublishedPDF')
            displatButton.bindProperty("visible", {
                path: "VisibilityViewAction"
            });            
        }, 
        onActionDraft: function(oSouce){
            let entityPath = this.getView().getBindingContext().getDeepPath()
            let oModel = this.getView().getModel()
            let thatControllerObject = this
            thatControllerObject.zeinvhddtBusyDialogObject.open()
            let readEntity = new Promise((resolve, reject)=>{
                oModel.read(entityPath,{
                    success: function(oHeader){
                        let callFunction = ''
                        switch(oHeader.LoaiHoaDon) {
                            case 'NORM':
                                callFunction = 'GETDRAFT'
                                break;
                            case 'REP':
                                callFunction = 'GETDRAFT_REPLACE'
                                break;
                            case 'ADJ':
                                callFunction = 'GETDRAFT_ADJUST'
                                break;
                        }
                        oModel.read(`${entityPath}/to_Item`, {
                            success: function(oItem){
                                let url = "https://" + window.location.hostname + "/sap/bc/http/sap/ZEINV_API_HOADON?=";
                                $.ajax({    
                                    url: url,
                                    type: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        function : callFunction,
                                        header: oHeader,
                                        item: oItem.results
                                    }).replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');}) ,
                                    success: function (response, textStatus, jqXHR) {
                                        let responseJSON  = JSON.parse(response)
                                        if  (responseJSON.status == 'S'){
                                            if (callFunction == 'GETDRAFT_REPLACE' || callFunction == 'GETDRAFT_ADJUST') {
                                                var parser = new DOMParser();
                                                var doc = parser.parseFromString(responseJSON.pdf, "text/html");
                                                //now get it's contents and place into a blob
                                                const blob = new Blob([doc.documentElement.outerHTML], {
                                                  type: 'text/html'
                                                 });
                                                 
                                                //now convert to url
                                                const docUrl = window.URL.createObjectURL(blob); 
                                                
                                                //were done, lets create a href to this and download
                                                const aclick = document.createElement('a');
                                                aclick.href = docUrl;
                                                aclick.download = `${oHeader.sourcetype}@${oHeader.SoThamKhao}.html`;
                                                aclick.click();
                                            } else {
                                                var decodedPdfContent = atob(responseJSON.pdf)
                                                var byteArray = new Uint8Array(decodedPdfContent.length);
                                                for (var i = 0; i < decodedPdfContent.length; i++) {
                                                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                                                }
                                                var blob = new Blob([byteArray.buffer], {
                                                    type: 'application/pdf'
                                                });
                                                var _pdfurl = URL.createObjectURL(blob);
                                                if (!this._PDFViewer) {
                                                    this._PDFViewer = new sap.m.PDFViewer({
                                                        width: "auto",
                                                        source: _pdfurl,
                                                    });
                                                    jQuery.sap.addUrlWhitelist("blob");
                                                }
                                                this._PDFViewer.open();
                                            }
                                            
                                            thatControllerObject.zeinvhddtBusyDialogObject.close()
                                            
                                        } else if (responseJSON.status == 'F')  {
                                            MessageBox.error(responseJSON.message)
                                            thatControllerObject.zeinvhddtBusyDialogObject.close()
                                        }
                                    },
                                    error: function (error) {
                                        reject(error)
                                    }
                                }); 
                            },
                            error: function(error){
                                reject(error)
                            }
                        })
                    },      
                    error: function(error){
                        reject(error)
                    }
                })
            })
            readEntity
            .catch((value)=>{
                thatControllerObject.zeinvhddtBusyDialogObject.close()
                MessageBox.error(JSON.stringify(value))
            })
        },
        onActionReviewXML:function(oSouce){
            let entityPath = this.getView().getBindingContext().getDeepPath()
            let oModel = this.getView().getModel()
            let thatControllerObject = this
            thatControllerObject.zeinvhddtBusyDialogObject.open()
            let readEntity = new Promise((resolve, reject)=>{
                oModel.read(entityPath,{
                    success: function(oHeader){
                        oModel.read(`${entityPath}/to_Item`, {
                            success: function(oItem){
                                let callFunction = ''
                                switch(oHeader.LoaiHoaDon) {
                                    case 'NORM':
                                        callFunction = 'GETXML'
                                        break;
                                    case 'REP':
                                        callFunction = 'GETXML_REPLACE'
                                        break;
                                    case 'ADJ':
                                        callFunction = 'GETXML_ADJUST'
                                        break;
                                }
                                let url = "https://" + window.location.hostname + "/sap/bc/http/sap/ZEINV_API_HOADON?=";
                                $.ajax({    
                                    url: url,
                                    type: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        function : callFunction,
                                        header: oHeader,
                                        item: oItem.results
                                    }).replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');}) ,
                                    success: function (response, textStatus, jqXHR) {
                                        console.log(response)
                                        let data = new Blob([response], {type: 'text/xml'})
                                        let sTextFileURL = window.URL.createObjectURL(data)
                                        let a = document.createElement("a")
                                        a.href = sTextFileURL
                                        a.download = `${oHeader.sourcetype}@${oHeader.SoThamKhao}.xml`
                                        a.click();
                                        thatControllerObject.zeinvhddtBusyDialogObject.close()
                                    },
                                    error: function (error) {
                                        reject(error)
                                    }
                                });
                            },
                            error:function(error){
                                reject(error)
                            }
                        })
                    },
                    error: function(error){
                        reject(error)
                    }
                })
            })
            readEntity
            .catch((value)=>{
                thatControllerObject.zeinvhddtBusyDialogObject.close()
                MessageBox.error(JSON.stringify(value))
            })
        },
        on  :function(oEvent){
            let entityPath = this.getView().getBindingContext().getDeepPath()
            let oModel = this.getView().getModel()
            let thatControllerObject = this
            thatControllerObject.zeinvhddtBusyDialogObject.open()
            let readEntity = new Promise((resolve, reject)=>{
                oModel.read(entityPath,{
                    success: function(oHeader){
                        oModel.read(`${entityPath}/to_Item`, {
                            success: function(oItem){
                                let url = "https://" + window.location.hostname + "/sap/bc/http/sap/ZEINV_API_HOADON?=";
                                $.ajax({    
                                    url: url,
                                    type: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        function : 'GETPUBLISHPDF',
                                        header: oHeader,
                                        item: oItem.results
                                    }).replace(/"([^"]+)":/g,function($0,$1){return ('"'+$1.toLowerCase()+'":');}) ,
                                    success: function (response, textStatus, jqXHR) {
                                        let responseJSON  = JSON.parse(response)
                                        if  (responseJSON.status == 'S'){

                                                var decodedPdfContent = atob(responseJSON.pdf)
                                                var byteArray = new Uint8Array(decodedPdfContent.length);
                                                for (var i = 0; i < decodedPdfContent.length; i++) {
                                                    byteArray[i] = decodedPdfContent.charCodeAt(i);
                                                }
                                                var blob = new Blob([byteArray.buffer], {
                                                    type: 'application/pdf'
                                                });
                                                var _pdfurl = URL.createObjectURL(blob);
                                                if (!this._PDFViewer) {
                                                    this._PDFViewer = new sap.m.PDFViewer({
                                                        width: "auto",
                                                        source: _pdfurl,
                                                    });
                                                    jQuery.sap.addUrlWhitelist("blob");
                                                }
                                                this._PDFViewer.open();
                                            thatControllerObject.zeinvhddtBusyDialogObject.close()
                                            
                                        } else if (responseJSON.status == 'F')  {
                                            MessageBox.error(responseJSON.message)
                                            thatControllerObject.zeinvhddtBusyDialogObject.close()
                                        }
                                    },
                                    error: function (error) {
                                        reject(error)
                                    }
                                });
                            },
                            error: function(error){
                                reject(error)
                            }
                        })
                    },      
                    error: function(error){
                        reject(error)
                    }
                })
            })
            readEntity
            .catch((value)=>{
                thatControllerObject.zeinvhddtBusyDialogObject.close()
                MessageBox.error(JSON.stringify(value))
            })            
        }
    }
}
)