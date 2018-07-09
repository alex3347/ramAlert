const Koa = require('koa');

const Router = require('koa-router');
//用于render
const views = require('koa-views');
//用于模版引入静态文件
const serve = require('koa-static');
//用于引入文件夹路径
const path = require('./path.js');
const Monk = require('monk');


const app = new Koa();
const router = new Router();

const db=new Monk('localhost/userName');//链接到库
const test1 = db.get('test1');//表

app.use(serve(path));
//配置模板引擎
router.use(views(path + '/lib/'));

app.use(router.routes())
    .use(router.allowedMethods());

const addMem = async (ctx, next) => {
        await ctx.render('addMem.html');
};

const addData = async (ctx, next) => {
    let token = parseInt(Math.random()*100000+1)+ '';
    let key = ctx.params.key+''+token;

    let st = await test1.find({name:key});

    if(st.length !== 0){
        ctx.response.body = '用户名已存在，请检查输入是否正确';
    }else{
        await test1.insert({ name:key});
        ctx.response.body = 'http://localhost:3000/ram/'+key;
    }
};

const ram = async (ctx, next) => {
    let key = ctx.params.key+'';
    let st = await test1.find({name:key});

    if(st.length !== 0){
        await ctx.render('index.html');
    }else{
        ctx.response.body = '<p style="margin:0 auto;width:400px;">支付5Eos至 <span style="color:green;font-size:18px;">占位</span> <br>填写Memo:您的邮箱 <span style="color:gray">(例：123456@qq.com)</span></p><p style="margin:0 auto;width:400px;">之后五分钟内您将收到Ram价格预警链接</p><p style="margin:0 auto;width:400px;">如果忘记填写Memo,请发送邮件至</p>';
    }
};


router.get('/addMem', addMem);
router.get('/addData/:key?', addData);
router.get('/ram/:key?', ram);


app.listen(3000, function () {
    console.log('server start at 3000');
});