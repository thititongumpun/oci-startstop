"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.waiterConfiguration = exports.workRequestClient = exports.computeClient = void 0;
const oci_sdk_1 = require("oci-sdk");
const dotenv_1 = require("dotenv");
const oci_workrequests_1 = require("oci-workrequests");
(0, dotenv_1.config)();
const tenancy = process.env.TENANCY || '';
const user = process.env.USER || '';
const fingerprint = process.env.FINGERPRINT || '';
const passphrase = process.env.PASSPHRASE || null; // optional parameter
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAvnBNd5+oaC7qXmw0TpF6lnq1RcRpUwvgP5DgJ3XbwgHooPPI
oJmm4o1t6i0wwjlkFcHlba8j7B0Rtlol1j8tPPPkXuH8Cxa14GJFlAEVFNdIddy/
XMfyIepHikz/RFQfiOdNhKbTvLDenwEWHd9NpPTOO8o7gT3DL6ss013fG9uOrP6h
eVBU1V2EiIjV2xkZfHvhjEWr8tzzfr8TMIz5qtnrHzQ3MDEy9yF7u4um4Lsj3oOg
SE84gsTQ/dlqAHFoNoe1yM75E++J231Sk2zYUBu8jGeN/r//z8ldjbNFgEDqeJpX
DNgB/xM20Kxx4mjZQvv6hr/XwZucvHRQMrxXnwIDAQABAoIBAC07Y0r8YvWL3yLa
NHpM138SWifeBN4yveqbMIJu3elwpp5ECO0MUbURvn+WiDQ5iWoZibLJnJCiPui+
9Km0i7wkeaOHrWO82yoWbUxADY/LqmxEKDeTThF8Ic3Zh+/kwzCzL5hIP5ZbtCS0
D1q9BSYe9zUATa3ey5Nw5s61Rx7IWFkW5NKjiVouUE/1jKDn67ESA0kYDqeP6rM/
wwsiWySI8omsNn4IhoQ+lTErs8xzUkHfHB2nxuRXqtF5hZFBizRUMIh2zTwsBqPu
c4nUBYIYulKcXdaZLW9i24PcH92eZbUhS2oTJEdkCAruTrG2C8gEKMjPZwKJguMo
Tf52QXECgYEA5nfDU4Ihj5QBZJtXfsGVTVzy71/ThvrD8JjfgT50rC1VqpgQ9cmO
S479YNpjz0npKKiwaTzDtajSV56F8wZ7p56vf4dfv6+1gsM2QBvCBmybsN43/vKc
P50/cjkkWDfSec0IntExQFyY8aIItCEdOltE0WkXUOdbypfOvtQSk+UCgYEA04lI
oJk0Kj0wI8U7IefOQWaFa7EtPUhgz4i3Csbia7QdvgjJU1K4RlqasM5kck/BMdMX
1A9UTxwmZE11wRHatRU9V14HWwYzNKa3PkZ3v8vH8OrDCj7ok8AzXXRWjd3sEQcG
pHmk4C7KZ6uXYUMK/vMIB4RYPWe+M8GWtuuJTTMCgYEAitM3eHUZrDgWQrkEElmf
itNjjuelLlidcK9Vaq/pbdF9Gd6x0KxRp5gBbrb+il3WMeSzJyEwLpv74EWgIE0W
bVi8FFDCT2ATMSpP4nwV+vKvMfIZvtv7XKJnFnHvP6iYg0ALYkdWqJNemabmIUMV
LRLPOGlaXySN+VJKek6axjUCgYBdsQl08EZViwJeZYX6T3RgLStc9n2GDh+q6+++
mzY/4+fkennJKPMrXgfz1YZRxxdXnRqJtzxtSZeLh29nUyQeXkjsAF6bp1RYtpqk
v4tcbMKi5yf5ysEyZ8eYVeXcMfXT2NvNT3+CN9c4MZz73DjrkPL2eVyn3eI1hEHf
xNTsVwKBgBQLe+X70cK2xDIXQUog9D2IO1lfv522WCPrlHYe4UlOXSniQyiejdtj
OSS50qp2yerBk4iAsVUvp2qpv0+pEeKlUVh+hlONv23RMMbffGTQv6OliUgwczTu
A2Ss1Jt96Ctmk59n4RS9/3iswasFMzoqJ44RbJ0EurC1SpInhPeO
-----END RSA PRIVATE KEY-----
`;
const region = oci_sdk_1.common.Region.AP_SINGAPORE_1;
const provider = new oci_sdk_1.common.SimpleAuthenticationDetailsProvider(tenancy, user, fingerprint, privateKey, passphrase, region);
exports.computeClient = new oci_sdk_1.core.ComputeClient({
    authenticationDetailsProvider: provider,
});
const maxTimeInSeconds = 60 * 60; // The duration for waiter configuration before failing. Currently set to 1 hour.
const maxDelayInSeconds = 30; // The max delay for the waiter configuration. Currently set to 30 seconds
exports.workRequestClient = new oci_workrequests_1.WorkRequestClient({
    authenticationDetailsProvider: provider,
});
exports.waiterConfiguration = {
    terminationStrategy: new oci_sdk_1.common.MaxTimeTerminationStrategy(maxTimeInSeconds),
    delayStrategy: new oci_sdk_1.common.ExponentialBackoffDelayStrategy(maxDelayInSeconds),
};
