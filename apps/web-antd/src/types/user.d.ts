export interface UserInfo {
  /**
   * 组织ID
   */
  OuId: string;
  /*
   *组织
   */
  Ou: string;
  /**
   * 用户名
   */
  Account: string;

  /**
   * 角色
   */
  roles: string[];
  /**
   * 真实姓名
   */
  Displayname: string;
  /**
   * 用户ID
   */
  Id: string;
  /**
   * 锁定次数
   */
  AccessFailedCount: number;
  /**
   * 手机号
   */
  PhoneNumber: string;
  /**
   * 邮箱
   */
  Email: string;
  /**
   * 邮箱是否确认
   */
  EmailConfirmed: boolean;
  /**
   * 手机号是否确认
   */
  PhoneNumberConfirmed: boolean;
  /**
   * 是否锁定
   */
  LockoutEnabled: boolean;
  /**
   * 锁定时间
   */
  LockoutEnd: Date;
  /**
   * 密码是否为临时密码
   */
  IsTemporaryPassword: boolean;
}
