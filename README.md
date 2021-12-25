# promiseCache
promiseCache

一个简单的请求缓存：目前支持

1⃣️同一个key的请求 ，有缓存的情况下，会直接返回。

2⃣️同一个key的请求，如果没有缓存，且这个key处理速度比较慢会等这批key处理完统一回复。



👉主要看这个类就可以 utils/promiseCache.ts

```javascript
import cache from './utils/promiseCache';

function getName(param): Promise<any> {
    return new Promise(async (resolve, reject) => {
        console.info(`开始执行=>`);
        await new Promise(res => setTimeout(res, 3000));
        return resolve(param?.name || "无参数");
    });
}

//执行test方法
(async () => {
    const test1 = () => (
        new Promise((res, rej) => {
            //@ts-ignore
            res(getName());
        })
    )

    const test2 = () => (
        new Promise((res, rej) => {
            //@ts-ignore
            res(getName({ 'name': "test" }));
        })
    )
    const res = await cache.get('get-user', test2) // 如多次发起请求，只会请求一次
    console.info(res);
    const res2 = await cache.get('get-user', test1) // 如多次发起请求，只会请求一次
    console.info(res2);
})();

    /**
     * @param id 唯一键
     * @param promiseFun 异步方法
     * @param ttl 缓存老化时间 分钟
     * @param isRefresh 是否刷新缓存结果.true 则表示本次不使用缓存
     * @returns 
     */
 CachePromise 类里面的get()
```

