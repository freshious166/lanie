import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shipment } from './entities/shipment.entity';
import { SupplyChainController } from './supply-chain.controller';
import { SupplyChainService } from './supply-chain.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Shipment])
    ],
    controllers: [SupplyChainController],
    providers: [SupplyChainService]
})
export class SupplyChainModule {}
