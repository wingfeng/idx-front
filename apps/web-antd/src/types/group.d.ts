export interface GroupInfo {
  id?: number;
  name: string;
  description?: string;
  members?: Array<UserInfo>;
}
