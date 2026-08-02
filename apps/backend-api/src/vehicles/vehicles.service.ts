import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './entities/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) { }

  async create(createVehicleDto: CreateVehicleDto) {
    const existing = await this.vehiclesRepository.findOne({ where: { vin: createVehicleDto.vin } });
    if (existing) throw new ConflictException('VIN already exists');

    const vehicle = this.vehiclesRepository.create(createVehicleDto);
    return this.vehiclesRepository.save(vehicle);
  }

  findAll() {
    return this.vehiclesRepository.find({ relations: ['owner'] });
  }

  async findOne(id: string) {
    const vehicle = await this.vehiclesRepository.findOne({ where: { id }, relations: ['owner'] });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesRepository.update(id, updateVehicleDto);
  }

  async updateTelemetry(id: string, lat: number, lng: number, speed: number) {
    const vehicle = await this.findOne(id);
    vehicle.currentLat = lat;
    vehicle.currentLng = lng;
    vehicle.currentSpeed = speed;
    vehicle.lastPingAt = new Date();

    // Maintain history trail (max 50 points)
    if (!vehicle.telemetryHistory) {
      vehicle.telemetryHistory = [];
    }
    
    vehicle.telemetryHistory.push({
      lat: Number(lat),
      lng: Number(lng),
      speed: Number(speed),
      timestamp: vehicle.lastPingAt
    });

    if (vehicle.telemetryHistory.length > 50) {
      vehicle.telemetryHistory.shift(); // Remove oldest point
    }

    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string) {
    return this.vehiclesRepository.delete(id);
  }
}
