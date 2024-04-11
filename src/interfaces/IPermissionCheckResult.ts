export interface IPermissionCheckResult {
  result: boolean;
  missingPermissions: string[];
}