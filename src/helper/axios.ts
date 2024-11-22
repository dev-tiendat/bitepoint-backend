import _axios from 'axios';

const AXIOS_TIMEOUT = 60000;

const axios = _axios.create({
    timeout: AXIOS_TIMEOUT,
});

axios.interceptors.request.use(config => {
    if (!config.signal) config.signal = AbortSignal.timeout(60000);
    return config;
});

export { axios };
