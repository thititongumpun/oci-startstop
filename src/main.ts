import Koa from 'koa';
import Router from 'koa-router';
import { config } from 'dotenv';
import { computeClient } from './oci';
import { core } from 'oci-sdk';
// import { initCronJob } from './oci';
config();

// initCronJob();

const port = process.env.PORT || 3000;

const app = new Koa();
const router: Router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = `Healthy. ${new Date().toString()}`;
  await computeClient.instanceAction({
    instanceId:
      'ocid1.instance.oc1.ap-singapore-1.anzwsljrk644ttqcbsuzb5i34owl7zkwexpehfsweqrpbgbkdjkh34ubzuvq',
    action: core.requests.InstanceActionRequest.Action.Start,
  });
});

app.use(router.routes());

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
