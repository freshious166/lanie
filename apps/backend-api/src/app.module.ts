import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { AuthModule } from './auth/auth.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { ServiceRecordsModule } from './service-records/service-records.module';
import { VendorsModule } from './vendors/vendors.module';
import { BillingModule } from './billing/billing.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { IntelligenceModule } from './intelligence/intelligence.module';
import { HseModule } from './hse/hse.module';
import { SupplyChainModule } from './supply-chain/supply-chain.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<any>('DB_TYPE', 'postgres'),
        url: configService.get<string>('DATABASE_URL'),
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'lanie_user'),
        password: configService.get<string>('DB_PASSWORD', 'lanie_password'),
        database: configService.get<string>('DB_NAME', 'lanie_db'),
        ssl: configService.get<string>('DB_SSL') === 'true' ? { rejectUnauthorized: false } : false,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Auto-create tables (dev only)
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    VehiclesModule,
    AuthModule,
    ServiceRequestsModule,
    VendorsModule,
    BillingModule,
    MarketplaceModule,
    IntelligenceModule,
    HseModule,
    SupplyChainModule,
    ServiceRecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
