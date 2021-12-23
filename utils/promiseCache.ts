
import NodeCache = require('node-cache');

/**
 * @description 处理重复的promise对象请求
 */
interface Task<T = any> {
  resolve: (res: T) => void
  reject: (err: any) => void
}

const options = {
  maxKeys: 1000,
  stdTTL: 1000 * 60 * 60 * 1 //一小时
};
/**
 * 
 * @description 异步请求缓存
 * 
 * 执行异步任务, 它会处理重复发起的任务
 * 主要是get方法:id 为唯一键值，promiseFun为异步方法
 * 
 */
class CachePromise {
  private pendingTask: { [id: string]: Task[] } = {};
  private cache = new NodeCache(options);
  private isCache = false; //是否开启缓存功能

  constructor(isCache: boolean) {
    this.isCache = isCache;
  }

  /**
   * @param id 唯一键
   * @param promiseFun 异步方法
   * @param ttl 缓存老化时间 分钟
   * @param isRefresh 是否刷新缓存结果.true 则表示本次不使用缓存
   * @returns 
   */
  public async get<T>(id: string, promiseFun: () => Promise<T>, ttl: number = 30, isRefresh: boolean = false) {
    if (id in this.pendingTask) {
      return new Promise((resolve:any, reject:any) => {
        this.pendingTask[id].push({ resolve, reject })
      })
    }

    if (this.isCache && !isRefresh && this.cache.get(id)) { //如果开启缓存，缓存里面有就返回缓存里面的
      return this.cache.get(id);
    }

    let res: T | undefined
    let err: any
    try {
      this.pendingTask[id] = [];
      res = await promiseFun();
      this.isCache && this.setCache(id, res,ttl);
    } catch (err) {
      err = err
    }

    for (let t of this.pendingTask[id]) {
      if (err != null) {
        t.reject(err)
      } else {
        t.resolve(res)
      }
    }

    delete this.pendingTask[id];

    if (err != null) {
      throw err;
    }

    return res as T;
  }

  /**
   * @description 更新缓存
   * @param id 
   * @param result 
   * @param ttl 
   * @returns 
   */
  private async setCache(id: string, result: any, ttl: number = 30) {
    const TTL_MINUTE = 60; //1分钟
    this.cache.set(id, result, TTL_MINUTE * ttl);
    return result;
  }

  /**
   * 强制刷新全部缓存
   * @returns 
   */
  public flushCache() {
    this.cache.flushAll();
    return "success";
  }

}

const cache = new CachePromise(true);
export default cache;
