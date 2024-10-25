export interface RoleInfo {
  id?: number;
  name: string;
  description?: string;
  Claims?: any;
  members?: Array<UserInfo>;
}
