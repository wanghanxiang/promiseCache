import cache from './utils/promiseCache';

function getName(name: string):Promise<any> {
    return new Promise(async (resolve, reject) => {
        await new Promise(res => setTimeout(res, 3000));
        return resolve(name);
    });
}

//执行python代码块
(async () => {
    const res = await cache.get('get-user', getName("123")) // 如多次发起请求，只会请求一次
    console.info(res)
    const res2 = await cache.get('get-user', getName("456")) // 如多次发起请求，只会请求一次
    console.info(res2)
})();