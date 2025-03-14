import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';
import * as MySQLStore from 'express-mysql-session';
import { createPool } from 'mysql2';

const MySQLStore = require('express-mysql-session')(session);

const pool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 1000 * 60 * 60 * 24,
  },
  pool,
);

@Module({})
export class SessionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: process.env.SESSION_SECRET,
          store: sessionStore,
          resave: false,
          saveUninitialized: false,
          cookie: {
            httpOnly: true,
            secure: 'auto',
            maxAge: 1000 * 60 * 60 * 24,
          },
        }),
        passport.initialize(),
        passport.session(),
      )
      .forRoutes('*');
  }
}
