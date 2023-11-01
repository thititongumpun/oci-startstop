import { common, core } from 'oci-sdk';
import { readFileSync } from 'fs';
import cron from 'node-cron';
import { config } from 'dotenv';
config();

const tenancy = process.env.TENANCY || '';
const user = process.env.USER || '';
const fingerprint = process.env.FINGERPRINT || '';
const passphrase = process.env.PASSPHRASE || null; // optional parameter
const privateKey = readFileSync('./keys/secretKey.pem', {
  encoding: 'utf8',
});
const region: common.Region = common.Region.AP_SINGAPORE_1;

const provider = new common.SimpleAuthenticationDetailsProvider(
  tenancy,
  user,
  fingerprint,
  privateKey,
  passphrase,
  region
);

const computeClient = new core.ComputeClient({
  authenticationDetailsProvider: provider,
});

const instances = readFileSync('./README.md', { encoding: 'utf8' });
const data = instances
  .split('\n')
  .filter((line) => line.startsWith('- '))
  .map((line) => line.split('- ')[1]);

async function getListAllInstances(compartmentId: string) {
  for await (const instance of computeClient.listAllInstances({
    compartmentId: compartmentId,
  })) {
    console.log(
      `${instance.displayName} [${instance.id}] current status is ${instance.lifecycleState}`
    );
  }
}

cron.schedule(
  '* * * * *',
  async () => {
    // await computeClient.instanceAction({
    //   instanceId: "ocid1.instance.oc1.ap-singapore-1.anzwsljrk644ttqcbsuzb5i34owl7zkwexpehfsweqrpbgbkdjkh34ubzuvq",
    //   action: core.requests.InstanceActionRequest.Action.Start
    // })
    // console.log();
    await getListAllInstances(process.env.COMPARTMENTID as string);

    console.log('data', data);
  },
  { timezone: 'Asia/Bangkok' }
);
