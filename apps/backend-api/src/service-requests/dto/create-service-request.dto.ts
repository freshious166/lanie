export class CreateServiceRequestDto {
    type: any; // validation should handle enum
    description?: string;
    location?: string;
    vehicleId?: string;
}
