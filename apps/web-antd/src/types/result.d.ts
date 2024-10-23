export interface APIResult<T = any> {
  /**
   * 状态码
   */
  code: number;
  /**
   * 提示信息
   */
  messsage: string;
  /**
   * 数据
   */
  data: T;
}
