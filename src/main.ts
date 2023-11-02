import Koa from 'koa';
import Router from 'koa-router';
import { config } from 'dotenv';
import { computeClient, waiterConfiguration, workRequestClient } from './oci';
import { core } from 'oci-sdk';
config();

const port = process.env.PORT || 3000;

const app = new Koa();
const router: Router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  ctx.body = `Healthy. ${new Date().toString()} asdasd`;

  const res = await fetch(
    'https://raw.githubusercontent.com/thititongumpun/oci-startstop/master/README.md'
  );

  const text = await res.text();
  const instances = text.split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.split('- ')[1]);


  const computeWaiter = computeClient.createWaiters(workRequestClient, waiterConfiguration);
  for (const instance of instances) {
    await computeClient.instanceAction({
      instanceId: instance,
      action: core.requests.InstanceActionRequest.Action.Start,
    });

    const getInstanceRequest: core.requests.GetInstanceRequest = {
      instanceId: instance
    };

    await computeWaiter.forInstance(
      getInstanceRequest,
      core.models.Instance.LifecycleState.Starting
    )
  }
});

router.get('/raw', async (ctx: Koa.Context) => {
  const data = await fetch(
    'https://raw.githubusercontent.com/thititongumpun/oci-startstop/master/README.md'
  );
  const text = await data.text();
  ctx.body = text
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.split('- ')[1]);
});

app.use(router.routes());

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
