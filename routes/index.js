const router = require('koa-router')();
const superagent = require('superagent');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string233'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.post('/login', async (ctx, next) => {
  let { code } = ctx.request.body;
  let openid = await getOpenid(code);
  console.log("######openid:", openid)
  ctx.body = {
    data: openid
  }

  // try {
  //   let openid = await getOpenid(code);
  //   if (openid) ctx.body = { data: openid }
  //   else ctx.body = { status: -2, message: 'ID错误, 无法找到数据' }
  // } catch (e) {
  //   ctx.body = { status: -1, message }
  // }
})

function getOpenid (code) {
  let appid = 'wxaac16345964907c5';
  let secret = '9162295154e09f8607ee4022caa4a43c';
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  superagent.get(url) //这里的URL也可以是绝对路径
  .end(function (err, res) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("!!!!!!openid:", JSON.parse(res.text).openid )
    return JSON.parse(res.text).openid;
  });
}

module.exports = router
