import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaystackService {
    private readonly logger = new Logger(PaystackService.name);
    private readonly secretKey: string;
    private readonly baseUrl = 'https://api.paystack.co';

    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ) {
        this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY') || 'sk_test_mock';
    }

    private getHeaders() {
        return {
            Authorization: `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json',
        };
    }

    async createCustomer(email: string, firstName: string, lastName: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/customer`, { email, first_name: firstName, last_name: lastName }, { headers: this.getHeaders() })
            );
            return response.data;
        } catch (error) {
            this.logger.error('Error creating Paystack customer', error);
            throw error;
        }
    }

    async initializeTransaction(email: string, amount: number, planCode?: string) {
        try {
            const payload: any = { email, amount: amount * 100 }; // Paystack uses kobo
            if (planCode) {
                payload.plan = planCode;
            }
            const response = await firstValueFrom(
                this.httpService.post(`${this.baseUrl}/transaction/initialize`, payload, { headers: this.getHeaders() })
            );
            return response.data;
        } catch (error) {
            this.logger.error('Error initializing Paystack transaction', error);
            throw error;
        }
    }

    async verifyTransaction(reference: string) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(`${this.baseUrl}/transaction/verify/${reference}`, { headers: this.getHeaders() })
            );
            return response.data;
        } catch (error) {
            this.logger.error('Error verifying Paystack transaction', error);
            throw error;
        }
    }
}
