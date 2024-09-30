export interface OrgUnitInfo {
  /**
   * 唯一标识
   */
  id: bigint;
  /**
   * 名称
   */
  name: string;
  /**
   * 显示名称
   */
  displayname: string;
  /**
   * 父节点
   */
  parentId?: bigint;
  /**
   * 父节点名称
   */
  parentName: string;
  /**
   * 描述
   */
  description: string;
  /**
   * 排序
   */
}
