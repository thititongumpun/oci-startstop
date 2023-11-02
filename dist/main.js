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
const koa_1 = __importDefault(require("koa"));
const koa_router_1 = __importDefault(require("koa-router"));
const dotenv_1 = require("dotenv");
const oci_1 = require("./oci");
const oci_sdk_1 = require("oci-sdk");
(0, dotenv_1.config)();
const port = process.env.PORT || 3000;
const app = new koa_1.default();
const router = new koa_router_1.default();
router.get('/', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = `Healthy. ${new Date().toString()} asdasd`;
    const res = yield fetch('https://raw.githubusercontent.com/thititongumpun/oci-startstop/master/README.md');
    const text = yield res.text();
    const instances = text.split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => line.split('- ')[1]);
    const computeWaiter = oci_1.computeClient.createWaiters(oci_1.workRequestClient, oci_1.waiterConfiguration);
    for (const instance of instances) {
        yield oci_1.computeClient.instanceAction({
            instanceId: instance,
            action: oci_sdk_1.core.requests.InstanceActionRequest.Action.Start,
        });
        const getInstanceRequest = {
            instanceId: instance
        };
        yield computeWaiter.forInstance(getInstanceRequest, oci_sdk_1.core.models.Instance.LifecycleState.Starting);
    }
}));
router.get('/raw', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch('https://raw.githubusercontent.com/thititongumpun/oci-startstop/master/README.md');
    const text = yield data.text();
    ctx.body = text
        .split('\n')
        .filter((line) => line.startsWith('- '))
        .map((line) => line.split('- ')[1]);
}));
app.use(router.routes());
app.listen(port, () => {
    console.log(`Application is running on port ${port}`);
});
