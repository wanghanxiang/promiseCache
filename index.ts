import cache from './utils/promiseCache';

function getName(param): Promise<any> {
    return new Promise(async (resolve, reject) => {
        console.info(`开始执行=>`);
        await new Promise(res => setTimeout(res, 3000));
        return resolve(param.name);
    });
}

//执行python代码块
(async () => {
    const res = await cache.get('get-user', getName, { name: '123' }) // 如多次发起请求，只会请求一次
    console.info(res)
    const res2 = await cache.get('get-user', getName, { name: '123' }) // 如多次发起请求，只会请求一次
    console.info(res2)
    setInterval(async()=>{
       let _t =  await cache.get('get-user', getName, { name: '123' })
       console.info(_t)
    },10000)
})();