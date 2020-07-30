# 教学资源信息PC

#### Structure
```javascript
├─src
|  ├─App.vue
|  ├─main.js						
|  ├─router                         		//全局路由入口
|  |   └index.js
|  ├─mixins									//字典、枚举混入对象
|  |   └dictMixin.js
|  ├─components								//通用类组件库
|  |     ├─tableGroup		
|  |     |     └TablePagination.vue  		//table分页组件
|  |     ├─table							//table类组件
|  |     |   ├─EditTable.vue				//单一（详情类table）
|  |     |   ├─index.vue					//通用类表格组件
|  |     |   ├─tableOperate.vue
|  |     |   ├─table_2.vue
|  |     |   └table_3.vue
|  |     ├─searchBar
|  |     |     └searchBar.vue				//查询组件（表单列表、单一，多条件查询）
|  |     ├─pop								//pop弹窗组件
|  |     |  ├─AssetSelectTable.vue			//table数据选择组件（查询+表单）
|  |     |  ├─ModifyPsw.vue
|  |     |  └TeachSelectTable.vue
|  |     ├─Menu
|  |     |  └Index.vue
|  |     ├─include
|  |     |    ├─XAside.vue
|  |     |    ├─XFooter.vue
|  |     |    ├─XHeader.vue
|  |     |    └XTabbar.vue
|  |     ├─form
|  |     |  └FormList.vue					//
|  |     ├─comPower
|  |     |    ├─comPower.vue
|  |     |    └index.vue
|  |     ├─common
|  |     |   ├─BtnGroup.vue
|  |     |   └upload.vue
|  |     ├─button
|  |     |   ├─resetBtn.vue
|  |     |   └searchBtn.vue
|  ├─views							 //主功能模块
|  |   ├─teachingMaterial
|  |   |        ├─router.js
|  |   |        ├─teachPutStorage
|  |   |        |        ├─api.js
|  |   |        |        ├─putStorage.vue
|  |   |        |        ├─putStorageDetail.vue
|  |   |        |        ├─router.js
|  |   |        |        └教材入库管理
|  |   |        ├─teachPurchase
|  |   |        |       ├─api.js
|  |   |        |       ├─createPurchase.vue
|  |   |        |       ├─purchaseManage.vue
|  |   |        |       ├─purchaseManageDetail.vue
|  |   |        |       ├─router.js
|  |   |        |       └教材采购管理
|  |   |        ├─teachIssue
|  |   |        |     ├─aloneApply.vue
|  |   |        |     ├─aloneApplyDetail.vue
|  |   |        |     ├─api.js
|  |   |        |     ├─issueList.vue
|  |   |        |     ├─manyAudit.vue
|  |   |        |     ├─manyAuditDetail.vue
|  |   |        |     ├─putReport.vue
|  |   |        |     ├─putReportDetail.vue
|  |   |        |     ├─router.js
|  |   |        |     ├─teachAudit.vue
|  |   |        |     ├─teachAuditDetail.vue
|  |   |        |     ├─teachIssue.vue
|  |   |        |     ├─teachIssueDetail.vue
|  |   |        |     └教材发放管理
|  |   |        ├─teachingMaterialInventory
|  |   |        |             ├─adjustment.vue
|  |   |        |             ├─adjustmentDetail.vue
|  |   |        |             ├─api.js
|  |   |        |             ├─inventory.vue
|  |   |        |             ├─inventoryDetail.vue
|  |   |        |             ├─inventoryInquire.vue
|  |   |        |             ├─router.js
|  |   |        |             └教材库存管理
|  |   |        ├─confidentialInformation
|  |   |        |            ├─api.js
|  |   |        |            ├─confidentialInformationEntry.vue
|  |   |        |            ├─confidentialInformationLedger.vue
|  |   |        |            ├─confidentialInformationLedgerDetail.vue
|  |   |        |            ├─confidentialityLevel.vue
|  |   |        |            ├─confidentialityLevelDetail.vue
|  |   |        |            ├─dataQuery.vue
|  |   |        |            ├─router.js
|  |   |        |            └保密资料
|  |   |        ├─basicDict
|  |   |        |     ├─api.js
|  |   |        |     ├─AssetType.vue
|  |   |        |     ├─AssetTypeDetail.vue
|  |   |        |     ├─CourseDict.vue
|  |   |        |     ├─CourseDictDetail.vue
|  |   |        |     ├─CourseType.vue
|  |   |        |     ├─CourseTypeDetail.vue
|  |   |        |     ├─router.js
|  |   |        |     ├─TeachingType.vue
|  |   |        |     ├─TeachingTypeDetail.vue
|  |   |        |     ├─TrainingLevel.vue
|  |   |        |     ├─TrainingLevelDetail.vue
|  |   |        |     ├─UnitYear.vue
|  |   |        |     ├─UnitYearDetail.vue
|  |   |        |     └基础字典
|  |   |        ├─assetTypeDetail
|  |   ├─teachAsset
|  |   |     ├─api.js
|  |   |     ├─router.js
|  |   |     ├─教学资产管理
|  |   |     ├─purchasePlan
|  |   |     |      ├─api.js
|  |   |     |      ├─CentralizedProcessing.vue
|  |   |     |      ├─PurchasePlan.vue
|  |   |     |      ├─PurchasePlanAudit.vue
|  |   |     |      ├─PurchasePlanAuditDetail.vue
|  |   |     |      ├─PurchasePlanDetail.vue
|  |   |     |      ├─router.js
|  |   |     |      └采购计划管理
|  |   |     ├─purchaseContract
|  |   |     |        ├─api.js
|  |   |     |        ├─PurchaseContract.vue
|  |   |     |        ├─PurchaseContractDetail.vue
|  |   |     |        ├─router.js
|  |   |     |        ├─Supplier.vue
|  |   |     |        ├─SupplierDetail.vue
|  |   |     |        └采购合同管理
|  |   |     ├─demandPlan
|  |   |     |     ├─api.js
|  |   |     |     ├─DemandApprove.vue
|  |   |     |     ├─DemandApproveDetail.vue
|  |   |     |     ├─DemandAudit.vue
|  |   |     |     ├─DemandAuditDetail.vue
|  |   |     |     ├─DemandDeclare.vue
|  |   |     |     ├─DemandDeclareDetail.vue
|  |   |     |     ├─router.js
|  |   |     |     └需求计划管理
|  |   |     ├─checkAcceptIn
|  |   |     |       ├─api.js
|  |   |     |       ├─assetAccept.vue
|  |   |     |       ├─assetacceptDetail.vue
|  |   |     |       ├─router.js
|  |   |     |       └验收入账管理
|  |   |     ├─baseDict
|  |   |     |    ├─api.js
|  |   |     |    ├─AssetSource.vue
|  |   |     |    ├─AssetSourceDetail.vue
|  |   |     |    ├─AssetStatus.vue
|  |   |     |    ├─AssetStatusDetail.vue
|  |   |     |    ├─AssetType.vue
|  |   |     |    ├─AssetTypeDetail.vue
|  |   |     |    ├─Depart.vue
|  |   |     |    ├─DepartDetail.vue
|  |   |     |    ├─router.js
|  |   |     |    ├─UnitMeasure.vue
|  |   |     |    ├─UnitMeasureDetail.vue
|  |   |     |    └基础字典管理
|  |   |     ├─assetTransfer
|  |   |     |       ├─api.js
|  |   |     |       ├─assetHandOver.vue
|  |   |     |       ├─assetHandOverDetail.vue
|  |   |     |       ├─router.js
|  |   |     |       └资产移交管理
|  |   |     ├─assetStanding
|  |   |     |       ├─api.js
|  |   |     |       ├─parameterManage.vue
|  |   |     |       ├─parameterManageDetail.vue
|  |   |     |       ├─parameterUse.vue
|  |   |     |       ├─parameterUseDetail.vue
|  |   |     |       ├─router.js
|  |   |     |       └资产台账管理
|  |   |     ├─assetHandle
|  |   |     |      ├─api.js
|  |   |     |      ├─AssetAbortHandle.vue
|  |   |     |      ├─AssetAbortHandleDetail.vue
|  |   |     |      ├─AssetScrapApply.vue
|  |   |     |      ├─AssetScrapApplyDetail.vue
|  |   |     |      ├─AssetScrapExam.vue
|  |   |     |      ├─AssetScrapExamDetail.vue
|  |   |     |      ├─AssetScrapRegister.vue
|  |   |     |      ├─AssetScrapRegisterDetail.vue
|  |   |     |      ├─router.js
|  |   |     |      └资产处置管理
|  |   |     ├─assetFix
|  |   |     |    ├─api.js
|  |   |     |    ├─AssetFix.vue
|  |   |     |    ├─AssetFixDetail.vue
|  |   |     |    ├─router.js
|  |   |     |    └资产维修保养管理
|  |   |     ├─assetDepreciation
|  |   |     |         ├─api.js
|  |   |     |         ├─DepreciationWay.vue
|  |   |     |         ├─DepreciationWayDetail.vue
|  |   |     |         ├─ProvisionDepreciation.vue
|  |   |     |         ├─router.js
|  |   |     |         └资产折旧管理
|  |   |     ├─assetCollect
|  |   |     |      ├─api.js
|  |   |     |      ├─assetCollectApply.vue
|  |   |     |      ├─assetCollectApplyDetail.vue
|  |   |     |      ├─assetCollectAudit.vue
|  |   |     |      ├─assetCollectAuditDetail.vue
|  |   |     |      ├─router.js
|  |   |     |      └资产领用管理
|  |   |     ├─assetCheck
|  |   |     |     ├─api.js
|  |   |     |     ├─CheckPlanCreate.vue
|  |   |     |     ├─CheckPlanForm.vue
|  |   |     |     ├─CheckPlanFormDetail.vue
|  |   |     |     ├─router.js
|  |   |     |     └资产清查管理
|  |   |     ├─assetAllocation
|  |   |     |        ├─AllocationApply.vue
|  |   |     |        ├─AllocationApplyDetail.vue
|  |   |     |        ├─AllocationConfirm.vue
|  |   |     |        ├─AllocationConfirmDetail.vue
|  |   |     |        ├─AllocationExam.vue
|  |   |     |        ├─AllocationExamDetail.vue
|  |   |     |        ├─api.js
|  |   |     |        ├─router.js
|  |   |     |        └资产调拨管理
|  |   ├─system
|  |   |   ├─api.js
|  |   |   ├─depart.vue
|  |   |   ├─loginManage.vue
|  |   |   ├─logManage.vue
|  |   |   ├─menu.vue
|  |   |   ├─role.vue
|  |   |   ├─router.js
|  |   |   └user.vue
|  |   ├─standardExpenses
|  |   |        ├─router.js
|  |   |        ├─standard
|  |   |        |    ├─api.js
|  |   |        |    ├─router.js
|  |   |        |    ├─Standard.vue
|  |   |        |    └StandardDetail.vue
|  |   ├─projectConstruct
|  |   |        ├─api.js
|  |   |        ├─router.js
|  |   |        ├─construct
|  |   |        |     ├─Construct.vue
|  |   |        |     ├─ConstructDetail.vue
|  |   |        |     ├─ConstructEditDetail.vue
|  |   |        |     └router.js
|  |   ├─login
|  |   |   ├─Login.vue
|  |   |   └router.js
|  |   ├─home
|  |   |  └Index.vue
|  |   ├─demo
|  |   |  ├─Index.vue
|  |   |  └Index2.vue
|  ├─util
|  |  ├─env.js
|  |  ├─index.js
|  |  ├─request.js
|  |  └RequireFilter.js
|  ├─store
|  |   ├─actions.js
|  |   ├─getters.js
|  |   ├─index.js
|  |   ├─mutations.js
|  |   ├─state.js
|  |   ├─modules
|  |   |    ├─baseModules.js
|  |   |    └parameter.js
|  ├─axios
|  |   ├─common.js
|  |   ├─Global.js						//
|  |   └index.js						//
|  ├─assets								//项目资源文件
|  |   ├─logo.png
|  |   ├─js
|  |   | ├─dicts.js
|  |   | └menus.js
|  |   ├─images
|  |   |   ├─assets.png
|  |   |   ├─baseDic.png
|  |   |   ├─baseFunds.png
|  |   |   ├─construction.png
|  |   |   ├─equip.png
|  |   |   ├─laboratory.png
|  |   |   ├─login.png
|  |   |   ├─loginBackground.png
|  |   |   ├─logo.png
|  |   |   ├─manage.png
|  |   |   ├─material.png
|  |   |   ├─office.png
|  |   |   ├─site.png
|  |   |   ├─software.png
|  |   |   ├─system.png
|  |   |   ├─user.png
|  |   |   └visual.png
|  |   ├─font
|  |   |  ├─iconfont.eot
|  |   |  ├─iconfont.json
|  |   |  ├─iconfont.svg
|  |   |  ├─iconfont.ttf
|  |   |  ├─iconfont.woff
|  |   |  └iconfont.woff2
|  |   ├─css
|  |   |  ├─common.less
|  |   |  ├─style.less
|  |   |  └variable.less
|  ├─api
|  |  ├─common
|  |  |   └demoServer.js
├─public
|   ├─favicon.ico
|   ├─index.html
|   ├─json
|   |  ├─dev.config.json
|   |  ├─menus.json
|   |  ├─prod.config.json
|   |  └test.config.json
```
#### Usage

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

