export interface OrgUnitInfo {
  /**
   * 唯一标识
   */
  Id: bigint;
  /**
   * 名称
   */
  Name: string;
  /**
   * 显示名称
   */
  Displayname: string;
  /**
   * 父节点
   */
  ParentId?: bigint;
  /**
   * 父节点名称
   */
  ParentName: string;
  /**
   * 描述
   */
  Description: string;
  /**
   * 排序
   */
}
export interface OrgTreeResponse {
  items: Array<OrgUnitInfo>;
}
