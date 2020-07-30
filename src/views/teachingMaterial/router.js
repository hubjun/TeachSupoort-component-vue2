import { teachingMaterialInventory } from './teachingMaterialInventory/router';
import { confidentialInformation } from './confidentialInformation/router';
import { teachPurchase } from './teachPurchase/router';
import { teachPutStorage } from './teachPutStorage/router';
import { teachIssue } from './teachIssue/router';
import { basicDict } from './basicDict/router'


export const teachingMaterial = [
  ...teachingMaterialInventory,
  ...teachPutStorage,
  ...confidentialInformation,
  ...teachPurchase,
  ...teachIssue,
  ...basicDict
]


