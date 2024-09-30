export interface UserInfo {
  /**
   * 组织ID
   */
  ouid: string;
  /*
   *组织
   */
  ou: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 角色
   */
  roles: string[];
  /**
   * 真实姓名
   */
  displayname: string;
  /**
   * 用户ID
   */
  id: string;
  /**
   * 锁定次数
   */
  accessfailedcount: number;
  /**
   * 手机号
   */
  phonenumber: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 邮箱是否确认
   */
  emailconfirmed: boolean;
  /**
   * 手机号是否确认
   */
  phoneNumberConfirmed: boolean;
  /**
   * 是否锁定
   */
  lockoutenabled: boolean;
  /**
   * 锁定时间
   */
  lockoutEnd: Date;
  /**
   * 密码是否为临时密码
   */
  istemporarypassword: boolean;
}
