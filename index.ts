import cache from './utils/promiseCache';

function getName(): Promise<string> {
  return new Promise(async (resolve, reject) => {
    await new Promise(res => setTimeout(res, 3000));
    return resolve("{123}");
  });
}

//执行python代码块
(async () => {
  const res = await cache.get<string>('get-user', getName) // 如多次发起请求，只会请求一次
  console.info(res)
  const res2 = await cache.get('get-user', getName) // 如多次发起请求，只会请求一次
  console.info(res2)
})();