export class CreateUserDto {
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    role?: any; // typed as any for now to avoid circular dependency issues, validation should handle enum
}
