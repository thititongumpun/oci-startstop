import Koa from 'koa';
import Router from 'koa-router';
import { config } from 'dotenv';
import Oci from './oci';
import { common, core } from 'oci-sdk';

config();

const port = process.env.PORT || 3000;

const app = new Koa();
const router: Router = new Router();

router.get('/', async (ctx: Koa.Context) => {
  const res = await fetch(
    'https://raw.githubusercontent.com/thititongumpun/oci-startstop/master/README.md'
  );

  const text = await res.text();
  const sgInstances = text
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.split('- ')[1]);

  const sgOCI = new Oci(common.Region.AP_SINGAPORE_1);

  const computeWaiter = sgOCI
    .getComputeClient()
    .createWaiters(
      sgOCI.getWorkerRequestClient(),
      sgOCI.getWaiterConfiguration()
    );

  for (const instance of sgInstances) {
    const getInstanceRequest: core.requests.GetInstanceRequest = {
      instanceId: instance,
    };

    const getInstanceResponse = await computeWaiter.forInstance(
      getInstanceRequest,
      core.models.Instance.LifecycleState.Stopped
    );

    console.log(getInstanceResponse?.instance.lifecycleState)

    if (
      getInstanceResponse?.instance.lifecycleState ===
      core.models.Instance.LifecycleState.Stopped
    ) {
      await sgOCI.getComputeClient().instanceAction({
        instanceId: instance,
        action: core.requests.InstanceActionRequest.Action.Start,
      });
    }

    getInstanceResponse?.instance.lifecycleState ===
      core.models.Instance.LifecycleState.Stopped ? await sgOCI.getComputeClient().instanceAction({
        instanceId: instance,
        action: core.requests.InstanceActionRequest.Action.Start,
      }) : await sgOCI.getComputeClient().instanceAction({
        instanceId: instance,
        action: core.requests.InstanceActionRequest.Action.Stop,
      });
  }

  ctx.body = `Process Done. ${new Date().toString()}`;
});

router.get('/status', async (ctx: Koa.Context) => {
  const instances = [];
  const region =
    ctx.query.region === 'tokyo'
      ? common.Region.AP_TOKYO_1
      : common.Region.AP_SINGAPORE_1;
  const oci = new Oci(region);

  for await (const instance of oci
    .getComputeClient()
    .listAllInstances({ compartmentId: process.env.COMPARTMENTID as string })) {
    instances.push({
      displayName: instance.displayName,
      instanceId: instance.id,
      lifecycleState: instance.lifecycleState,
    });
  }

  ctx.body = {
    instances: instances,
  };
});

app.use(router.routes());

app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});
