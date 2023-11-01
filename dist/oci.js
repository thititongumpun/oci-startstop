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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
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
function getListAllInstances(compartmentId) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            for (var _d = true, _e = __asyncValues(computeClient.listAllInstances({
                compartmentId: compartmentId,
            })), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                _c = _f.value;
                _d = false;
                const instance = _c;
                console.log(`${instance.displayName} [${instance.id}] current status is ${instance.lifecycleState}`);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
const initCronJob = () => {
    const cronjob = node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
        // await computeClient.instanceAction({
        //   instanceId: "ocid1.instance.oc1.ap-singapore-1.anzwsljrk644ttqcbsuzb5i34owl7zkwexpehfsweqrpbgbkdjkh34ubzuvq",
        //   action: core.requests.InstanceActionRequest.Action.Start
        // })
        // console.log();
        yield getListAllInstances(process.env.COMPARTMENTID);
        console.log('data', data);
    }), { timezone: 'Asia/Bangkok' });
    cronjob.start();
};
exports.initCronJob = initCronJob;
