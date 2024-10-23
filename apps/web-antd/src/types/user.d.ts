export interface UserInfo {
  /**
   * 组织ID
   */
  ouId?: bigint;
  /*
   *组织
   */
  ou?: string;
  /**
   * 用户名
   */
  account?: string;

  /**
   * 角色
   */
  roles?: string[];
  /**
   * 真实姓名
   */
  displayName?: string;
  /**
   * 用户ID
   */
  id?: string;
  /**
   * 锁定次数
   */
  accessFailedCount?: number;
  /**
   * 手机号
   */
  phoneNumber?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 邮箱是否确认
   */
  emailConfirmed?: boolean;
  /**
   * 手机号是否确认
   */
  phoneNumberConfirmed?: boolean;
  /**
   * 是否锁定
   */
  lockoutEnabled?: boolean;
  /**
   * 锁定时间
   */
  lockoutEnd?: Date;
  /**
   * 密码是否为临时密码
   */
  isTemporaryPassword?: boolean;
}

export interface ResetPwdResponse {
  NewPwd: string;
}
