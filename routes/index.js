const router = require('koa-router')();
const superagent = require('superagent');
const {query} = require('../utils/mysql');
router.prefix('/api')
router.post('/login', async (ctx, next) => {
  // 获取openid
  let { code } = ctx.request.body;
  let appid = 'wxaac16345964907c5';
  let secret = '9162295154e09f8607ee4022caa4a43c';
  let url = `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`;
  let res = await superagent.get(url);
  const openid = JSON.parse(res.text).openid;
  // const openid = 'ddd';

  // 查询数据库，决定列表，新用户默认新建列表
  const resposeData = await query(`select * from decideList where openid = '${openid}'`, null).then(async (result) => {
    if (result.length > 0) {
      return { code: 0, data: result[0] };
    } else {
      const list = [
        { "title": "今天午饭吃什么?", "options":["火锅", "麻辣烫", "烧烤", "肯德基", "海鲜自助", "醉得意", "鱼粉"]},
        { "title": "今晚吃什么？", "options": ["烧鸡", "烧鸭", "烧鹅"]}
      ];
      let res2 = await query(`insert into decideList (openid,list) values (?,?)`, [openid, JSON.stringify(list)]).then(async (result2) => {
        let res3 = await query(`select * from decideList where openid = '${openid}'`, null).then((result3) => {
          if (result3.length > 0) {
            return { code: 0, data: result3[0] };
          }
        })
        return res3;
      })
      return res2;
    }
  })

  ctx.body = resposeData;

})

module.exports = router
