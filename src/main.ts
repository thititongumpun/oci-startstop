// import { initCronJob } from './oci';
import Koa from 'koa';
import Router from 'koa-router';
import { config } from 'dotenv';
config();

// initCronJob();

const port = process.env.PORT || 3000;

const app = new Koa();
const router: Router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = `Healthy. Koa ${process.env.TENANCY || ''}`;
});

app.use(router.routes());

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
