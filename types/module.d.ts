import 'fastify';

declare module 'fastify' {
    interface FastifyRequest {
        user?: IAuthUser;
        accessToken: string;
    }
}

declare module 'nest-cls' {
    interface ClsStore {
        operateId: number;
    }
}
