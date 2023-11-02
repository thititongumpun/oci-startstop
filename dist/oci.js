"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCronJob = void 0;
const oci_sdk_1 = require("oci-sdk");
const fs_1 = require("fs");
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const tenancy = process.env.TENANCY || '';
const user = process.env.USER || '';
const fingerprint = process.env.FINGERPRINT || '';
const passphrase = process.env.PASSPHRASE || null; // optional parameter
const privateKey = (0, fs_1.readFileSync)('./keys/secretKey.pem', {
    encoding: 'utf8',
});
const region = oci_sdk_1.common.Region.AP_SINGAPORE_1;
const provider = new oci_sdk_1.common.SimpleAuthenticationDetailsProvider(tenancy, user, fingerprint, privateKey, passphrase, region);
const computeClient = new oci_sdk_1.core.ComputeClient({
    authenticationDetailsProvider: provider,
});
const instances = (0, fs_1.readFileSync)('./README.md', { encoding: 'utf8' });
const data = instances
    .split('\n')
    .filter((line) => line.startsWith('- '))
    .map((line) => line.split('- ')[1]);
// async function getListAllInstances(compartmentId: string) {
//   for await (const instance of computeClient.listAllInstances({
//     compartmentId: compartmentId,
//   })) {
//     console.log(
//       `${instance.displayName} [${instance.id}] current status is ${instance.lifecycleState}`
//     );
//   }
// }
const initCronJob = () => {
    const cronjob = node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        yield computeClient.instanceAction({
            instanceId: 'ocid1.instance.oc1.ap-singapore-1.anzwsljrk644ttqcbsuzb5i34owl7zkwexpehfsweqrpbgbkdjkh34ubzuvq',
            action: oci_sdk_1.core.requests.InstanceActionRequest.Action.Stop,
        });
        // console.log();
        // await getListAllInstances(process.env.COMPARTMENTID as string);
        console.log('data', data);
    }), { timezone: 'Asia/Bangkok' });
    cronjob.start();
};
exports.initCronJob = initCronJob;
