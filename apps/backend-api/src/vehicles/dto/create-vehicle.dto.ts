export class CreateVehicleDto {
    vin: string;
    plateNumber: string;
    make: string;
    model: string;
    year: number;
    color?: string;
    ownerId?: string;
}
