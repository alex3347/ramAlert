const Koa = require('koa');
const app = new Koa();

const Router = require('koa-router');
const router = new Router();

const views = require('koa-views');
const path = require('./path.js');

router.use(views(path + '/ram'));

app.use(router.routes())    //路由都引入进来
    .use(router.allowedMethods());

const about = ctx => {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
};

const main = ctx => {
    ctx.response.body = 'Hello World';
};

const test = async (ctx, next) => {
    await ctx.render('index.html');
};


router.get('/', main);
router.get('/about', about);
router.get('/test', test);


app.listen(3000, function () {
    console.log('server start at 3000');
});