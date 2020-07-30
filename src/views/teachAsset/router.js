import { baseDict } from './baseDict/router';
import { checkAcceptIn } from './checkAcceptIn/router'; // 验收入账管理
import { demandPlan } from './demandPlan/router';
import { purchasePlan } from './purchasePlan/router';
import { purchaseContract } from './purchaseContract/router';
import { assetAllocation } from './assetAllocation/router'; // 资产调拨管理
import { assetDepreciation } from './assetDepreciation/router'; // 资产折旧管理
import { assetFix } from './assetFix/router'; // 资产维修保养管理
import { assetCheck } from './assetCheck/router'; // 资产清查管理
import { assetHandle } from './assetHandle/router'; // 资产处置管理
import { assetStanding } from './assetStanding/router'; // 资产台账管理
import { assetCollect } from './assetCollect/router'; // 资产领用管理
import { assetTransfer } from './assetTransfer/router'; // 资产移交管理


export const teachAsset = [
  ...baseDict,
  ...checkAcceptIn,
  ...demandPlan,
  ...purchasePlan,
  ...purchaseContract,
  ...assetAllocation,
  ...assetDepreciation,
  ...assetFix,
  ...assetCheck,
  ...assetHandle,
  ...assetStanding,
  ...assetCollect,
  ...assetTransfer
]


