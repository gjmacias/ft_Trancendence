declare global {
  namespace Express {
    interface Request {
      backend?: boolean;
      game?: boolean;
    }
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    backend?: boolean;
    game?: boolean;
  }
}

export {}; 