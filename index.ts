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