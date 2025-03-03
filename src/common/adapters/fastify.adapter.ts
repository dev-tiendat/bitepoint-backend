import { FastifyAdapter } from '@nestjs/platform-fastify';
import FastifyMultipart from '@fastify/multipart';
import FastifyCookie from '@fastify/cookie';

const app: FastifyAdapter = new FastifyAdapter({
    trustProxy: true,
    logger: false,
});
export { app as fastifyApp };

app.register(FastifyMultipart, {
    limits: {
        fields: 10,
        fileSize: 1024 * 1024 * 6,
        files: 5,
    },
});

app.register(FastifyCookie, {
    secret: 'cookie-secret',
});

app.getInstance().addHook('onRequest', (request, reply, done) => {
    const { origin } = request.headers;
    if (!origin) request.headers.origin = request.headers.host;

    const { url } = request;
    if (url.endsWith('.php')) {
        reply.raw.statusMessage = 'PHP is not support on this machine!!!';

        return reply.code(418).send();
    }

    if (url.match(/favicon.ico$/) || url.match(/manifest.json$/))
        return reply.code(204).send();

    done();
});
