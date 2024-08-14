sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    'sap/m/MessageItem',
    'sap/m/MessageView',
    'sap/m/Dialog',
    'sap/ui/core/library',
    'sap/m/Button',
    'sap/ui/core/IconPool',
    'sap/m/Bar',
    'sap/m/Title',
    "sap/ui/model/Filter"
], function (Controller, Fragment, JSONModel, MessageBox, MessageItem, MessageView, Dialog, coreLibrary, Button, IconPool, Bar, Title, Filter) {
    const SOURCETYPEFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-sourcetype'
    const ACCOUNTINGDOCUMENTFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-AccountingDocument'
    const BILLINGDOCUMENTFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-BillingDocument'
    const BILLINGTYPEFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-BillingDocumentType'
    const SALESOFFICEFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-SalesOffice'
    const SALESGROUPFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-SalesGroup'
    const VENDORFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-Vendor'
    const PURCHASEORDERFILTERID = 'zeinvhddt::sap.suite.ui.generic.template.ListReport.view.ListReport::ZEINV_I_HOADON--listReportFilter-filterItemControl_BASIC-PurchaseOrder'
    var TitleLevel = coreLibrary.TitleLevel;
    return {
        onInit: function () {
            Fragment.load({
                id: "zeinvhddt",
                name: "zeinvhddt.ext.fragment.BusyObject",
                type: "XML",
                controller: this
            })
                .then((oDialog) => {
                    this.zeinvhddtBusyDialog = oDialog;
                })
                .catch(error => {
                    MessageBox.error('Vui lòng tải lại trang')
                });

            var oMessageTemplate = new MessageItem({ // Message view template
                type: '{type}',
                title: '{message}',
                groupName: '{group}'
            });
            let thatController = this
            this.oCallApiMsgView = new MessageView({ //MessageView for response from Post FI Doc API
                showDetailsPageHeader: false, itemSelect: function () {
                    oBackButton.setVisible(true);
                },
                items: {
                    path: "/",
                    template: oMessageTemplate
                },
                groupItems: true
            })
            var oBackButton = new Button({
                icon: IconPool.getIconURI("nav-back"),
                visible: false,
                press: function () {
                    thatController.oCallApiMsgView.navigateBack();
                    this.setVisible(false);
                }
            });
            this.oCallApiMsgViewDialog = new Dialog({
                resizable: true,
                content: this.oCallApiMsgView,
                state: 'Information',
                beginButton: new Button({
                    press: function () {
                        this.getParent().close();
                    },
                    text: "Close"
                }),
                customHeader: new Bar({
                    contentLeft: [oBackButton],
                    contentMiddle: [
                        new Title({
                            text: "Message",
                            level: TitleLevel.H1
                        })
                    ]
                }),
                contentHeight: "50%",
                contentWidth: "50%",
                verticalScrolling: false
            })

        },
        editableBillingFilter(mode) {
            
            /* Hiện tham số cho Billing */
            this.byId(BILLINGDOCUMENTFILTERID).setEditable(mode)
            this.byId(BILLINGTYPEFILTERID).setEditable(mode)
            this.byId(SALESOFFICEFILTERID).setEditable(mode)
            this.byId(SALESGROUPFILTERID).setEditable(mode)
            this.getView().byId('controlConfigurationAllBillingDetail').setVisible(mode)
            this.getView().byId('controlConfigLoaiHoaDon').setVisible(mode)
            this.getView().byId('radHoaDonDieuChinh').setVisible(mode)
            this.getView().byId('radHoaDonThayThe').setVisible(mode)

            let hide = !mode
            /* Ẩn tham số thuộc PO, FI */
            this.byId(ACCOUNTINGDOCUMENTFILTERID).setEditable(hide)
            this.byId(VENDORFILTERID).setEditable(hide)
            this.byId(PURCHASEORDERFILTERID).setEditable(hide)
        },
        editableFiFilter(mode) {
            /* Hiện tham số thuộc FI */
            this.byId(ACCOUNTINGDOCUMENTFILTERID).setEditable(mode)
            this.getView().byId('controlConfigLoaiHoaDon').setVisible(mode)

            /* Ẩn tham số thuộc BIll, PO */
            let hide = !mode
            this.byId(BILLINGDOCUMENTFILTERID).setEditable(hide)
            this.byId(BILLINGTYPEFILTERID).setEditable(hide)
            this.byId(SALESOFFICEFILTERID).setEditable(hide)
            this.byId(SALESGROUPFILTERID).setEditable(hide)
            this.getView().byId('controlConfigurationAllBillingDetail').setVisible(hide)
            this.getView().byId('radHoaDonDieuChinh').setVisible(hide)
            this.getView().byId('radHoaDonThayThe').setVisible(hide)
            this.byId(VENDORFILTERID).setEditable(hide)
            this.byId(PURCHASEORDERFILTERID).setEditable(hide)
        },
        editablePOFilter(mode) {
            /* Hiện tham số thuộc PO */
            this.byId(VENDORFILTERID).setEditable(mode)
            this.byId(PURCHASEORDERFILTERID).setEditable(mode)

            /* Ẩn tham số thuộc Bill, FI */
            let hide = !mode
            this.byId(BILLINGDOCUMENTFILTERID).setEditable(hide)
            this.byId(BILLINGTYPEFILTERID).setEditable(hide)
            this.byId(SALESOFFICEFILTERID).setEditable(hide)
            this.byId(SALESGROUPFILTERID).setEditable(hide)
            this.getView().byId('controlConfigurationAllBillingDetail').setVisible(hide)
            this.getView().byId('controlConfigLoaiHoaDon').setVisible(hide)
            this.byId(ACCOUNTINGDOCUMENTFILTERID).setEditable(hide)     

        },
        onInitSmartFilterBarExtension: function (oSource) {
            console.log(oSource.getSource()._oFiltersButton.sId)
            this.byId(oSource.getSource()._oFiltersButton.sId).setVisible(false)

            /* Default Billing khi vào chức năng */
            this.editableBillingFilter(true)
        },
        onBeforeRebindTableExtension: function (oSource) {
            // let oCheckBoxMaHuy = this.getView().byId("chkBoxDisplayMaHuy");

            let sourcetype = this.getView().byId('selectSourceType').getSelectedKey()
            let chkAllBillingDetail = this.getView().byId('chkAllBillingDetail').getSelected()
            let chkBillingGeneral = this.getView().byId('chkBillingGeneral').getSelected()
            let chkBillingAltUnit = this.getView().byId('chkBillingAltUnit').getSelected()

            // chkDispNSX
            let chkDispNSX = this.getView().byId('chkDispNSX').getSelected()
            let chkDispValueDV = this.getView().byId('chkDispValueDV').getSelected()
            let chkDispDvtDV = this.getView().byId('chkDispDvtDV').getSelected()
            let chkDispCK = this.getView().byId('chkDispCK').getSelected()

            //Loại nghiệp vụ hoá đơn
            let radHoaDonBan = this.getView().byId('radHoaDonBan').getSelected()
            let radHoaDonThayThe = this.getView().byId('radHoaDonThayThe').getSelected()
            let radHoaDonDieuChinh = this.getView().byId('radHoaDonDieuChinh').getSelected()
            let radHuyHoaDon = this.getView().byId('radHuyHoaDon').getSelected()
            let radXemDanhSach = this.getView().byId('radXemDanhSach').getSelected()

            //Lấy number format cho hoá đơn PTP
            let chkNumberFormatType = this.getView().byId('selNumberFormat').getSelectedKey()
            if (chkNumberFormatType && chkNumberFormatType == ''){
                chkNumberFormatType = '1'
            }

            //Read $fiter params to pass selected value in custom filter
            var oBindingParams = oSource.getParameter("bindingParams");
            oBindingParams.filters.push(new Filter('sourcetype', 'EQ', `${sourcetype}`))
            oBindingParams.filters.push(new Filter('AllBillingDetail', 'EQ', `${chkAllBillingDetail}`))
            oBindingParams.filters.push(new Filter('BillingGeneral', 'EQ', `${chkBillingGeneral}`))
            oBindingParams.filters.push(new Filter('BillingAltUnit', 'EQ', `${chkBillingAltUnit}`))
            oBindingParams.filters.push(new Filter('DispNSX', 'EQ', `${chkDispNSX}`))
            oBindingParams.filters.push(new Filter('DispValueDV', 'EQ', `${chkDispValueDV}` ))
            oBindingParams.filters.push(new Filter('DispDvtDV', 'EQ', `${chkDispDvtDV}`))
            oBindingParams.filters.push(new Filter('DispCK', 'EQ', `${chkDispCK}`))
            oBindingParams.filters.push(new Filter('NumberFormatType', 'EQ', `${chkNumberFormatType}`))

            switch(true) {
                case radHoaDonBan:
                    oBindingParams.filters.push(new Filter('LoaiHoaDon', 'EQ', `NORM`))
                    this.getView().byId('actionPublish').setVisible(true)
                    this.getView().byId('actionCancel').setVisible(false)      
                    break;
                case radHoaDonThayThe:
                    oBindingParams.filters.push(new Filter('LoaiHoaDon', 'EQ', `REP`))
                    this.getView().byId('actionPublish').setVisible(true)
                    this.getView().byId('actionCancel').setVisible(false)      
                    break;
                case radHoaDonDieuChinh:
                    oBindingParams.filters.push(new Filter('LoaiHoaDon', 'EQ', `ADJ`))
                    this.getView().byId('actionPublish').setVisible(true)
                    this.getView().byId('actionCancel').setVisible(false)      
                    break;
                case radHuyHoaDon:
                    oBindingParams.filters.push(new Filter('LoaiHoaDon', 'EQ', `CANC`))          
                    this.getView().byId('actionPublish').setVisible(false)
                    this.getView().byId('actionCancel').setVisible(true)               
                    break;
                case radXemDanhSach:
                    oBindingParams.filters.push(new Filter('LoaiHoaDon', 'EQ', `VIEW`))        
                    this.getView().byId('actionPublish').setVisible(false)
                    this.getView().byId('actionCancel').setVisible(false)                               
                    break;
            }
        },
        onChangeSourceType: function (oSource) {
            /* Change source type - Nguồn hoá đơn : FI - PO - BILLING */
            switch (oSource.getSource().getSelectedKey()) {
                case 'BILL':
                    this.editableBillingFilter(true)
                    break;
                case 'FI':
                    this.editableFiFilter(true)
                    if (this.getView().byId('radHoaDonDieuChinh').getSelected() == true || this.getView().byId('radHoaDonThayThe').getSelected() == true ) {
                        this.getView().byId('radHoaDonBan').setSelected(true)
                    }
                    break;
                case 'PO':
                    this.editablePOFilter(true)
                    break;
            }
        },
        callAPIEInvoice: function (element) {
            return new Promise((resolve, reject) => {
                let oModel = element.getModel()
                let radHoaDonBan = this.getView().byId('radHoaDonBan').getSelected()
                let radHoaDonThayThe = this.getView().byId('radHoaDonThayThe').getSelected()
                let radHoaDonDieuChinh = this.getView().byId('radHoaDonDieuChinh').getSelected()
                let radHuyHoaDon = this.getView().byId('radHuyHoaDon').getSelected()
                let callFunction = ''
                switch(true) {
                    case radHoaDonBan:
                        callFunction = 'PUBLISH'
                        break;
                    case radHoaDonThayThe:
                        callFunction = 'REPLACE'
                        break;
                    case radHoaDonDieuChinh:
                        callFunction = 'ADJUST'
                        break;
                    case radHuyHoaDon:
                        callFunction = 'CANCEL'                        
                }
                oModel.read(element.getPath(), {
                    success: function (oHeader, oResponse) {
                        oModel.read(`${element.getPath()}/to_Item`, {
                            success: function (oItem, oResponse) {
                                let url = "https://" + window.location.hostname + "/sap/bc/http/sap/ZEINV_API_HOADON?=";
                                $.ajax({
                                    url: url,
                                    type: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify({
                                        function: callFunction,
                                        header: oHeader,
                                        item: oItem.results
                                    }).replace(/"([^"]+)":/g, function ($0, $1) { return ('"' + $1.toLowerCase() + '":'); }),
                                    success: function (response, textStatus, jqXHR) {
                                        resolve(JSON.parse(response))
                                    },
                                    error: function (error) {
                                        reject(error)
                                    }
                                });
                            },
                            error: function (error) {
                                reject(error)
                            }
                        })
                    },
                    error: function (error) {
                        reject(error)
                    }
                })
            })
        },
        onActionPublish: function (oSouce) {
            let thatController = this
            let oPostCalls = []
            let oSelectedContext = this.extensionAPI.getSelectedContexts();
            oSelectedContext.forEach(element => {
                oPostCalls.push(thatController.callAPIEInvoice(element))
            })
            thatController.zeinvhddtBusyDialog.open()
            Promise.all(oPostCalls)
                .then((responseList) => {
                    let message = []
                    responseList.forEach(response => {
                        if (response.status && response.status !== '') {
                            message.push({
                                type: response.status == 'S' ? 'Success' : 'Error',
                                message: response.message,
                                group: `Fkey ${response.uuid}`
                            })
                        }

                    })
                    let messageJSON = JSON.parse(JSON.stringify(message))
                    var oMsgModel = new JSONModel();
                    oMsgModel.setData(messageJSON)
                    thatController.oCallApiMsgView.setModel(oMsgModel)
                    thatController.oCallApiMsgView.navigateBack();
                    thatController.oCallApiMsgViewDialog.open();
                    thatController.zeinvhddtBusyDialog.close()
                })
                .catch((error) => {
                    MessageBox.error(JSON.stringify(error))
                    thatController.zeinvhddtBusyDialog.close()
                })
        },
        onActionCancel: function(oSource){
            let thatController = this
            let oPostCalls = []
            let oSelectedContext = this.extensionAPI.getSelectedContexts();
            oSelectedContext.forEach(element => {
                oPostCalls.push(thatController.callAPIEInvoice(element))
            })
            thatController.zeinvhddtBusyDialog.open()
            Promise.all(oPostCalls)
                .then((responseList) => {
                    let message = []
                    responseList.forEach(response => {
                        if (response.status && response.status !== '') {
                            message.push({
                                type: response.status == 'S' ? 'Success' : 'Error',
                                message: response.message,
                                group: `Fkey ${response.uuid}`
                            })
                        }

                    })
                    let messageJSON = JSON.parse(JSON.stringify(message))
                    var oMsgModel = new JSONModel();
                    oMsgModel.setData(messageJSON)
                    thatController.oCallApiMsgView.setModel(oMsgModel)
                    thatController.oCallApiMsgView.navigateBack();
                    thatController.oCallApiMsgViewDialog.open();
                    thatController.zeinvhddtBusyDialog.close()
                    thatController.getView().getModel().refresh()
                })
                .catch((error) => {
                    MessageBox.error(JSON.stringify(error))
                    thatController.zeinvhddtBusyDialog.close()
                })
        },
        onChangeChkDispNSX: function(oSource){
            let chkDispNSX = this.getView().byId('chkDispNSX').getSelected()
            localStorage.setItem("chkDispNSX", chkDispNSX);
        },
        onChangeChkDispValueDV: function(oSource){
            let chkDispValueDV = this.getView().byId('chkDispValueDV').getSelected()
            localStorage.setItem("chkDispValueDV", chkDispValueDV);
        },
        onChangeChkDispDvtDV: function(oSource){
            let chkDispDvtDV = this.getView().byId('chkDispDvtDV').getSelected()
            localStorage.setItem("chkDispDvtDV", chkDispDvtDV);
        },
        onChangeChkDispCK: function(oSource){
            let chkDispCK = this.getView().byId('chkDispCK').getSelected()
            localStorage.setItem("chkDispCK", chkDispCK);
        }
    }
}
)