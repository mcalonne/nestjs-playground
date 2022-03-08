import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { LogRequestMiddleware } from './middlewares/log-request.middleware';
import { ConfigModule, ConfigService} from '@nestjs/config';
import { configValidationSchema } from './shared/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          // entities: [], // FIXME: adds the entities
          autoLoadEntities: true, // FIXME: only for dev; DO NOT USE IN PRODUCTION
          synchronize: true,
        } as TypeOrmModuleOptions;
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogRequestMiddleware).forRoutes('api');
  }
}
