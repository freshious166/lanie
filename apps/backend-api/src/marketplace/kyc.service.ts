import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorStatus } from '../vendors/entities/vendor.entity';

@Injectable()
export class KycService {
    constructor(
        @InjectRepository(Vendor)
        private vendorRepository: Repository<Vendor>
    ) {}

    async submitKyc(vendorId: string, data: { cacDocumentUrl: string, idDocumentUrl: string, addressProofUrl: string }) {
        const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
        if (!vendor) throw new NotFoundException('Vendor not found');

        vendor.cacDocumentUrl = data.cacDocumentUrl;
        vendor.idDocumentUrl = data.idDocumentUrl;
        vendor.addressProofUrl = data.addressProofUrl;
        vendor.status = VendorStatus.PENDING;
        
        return this.vendorRepository.save(vendor);
    }

    async verifyVendor(vendorId: string, adminId: string, isApproved: boolean) {
        const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
        if (!vendor) throw new NotFoundException('Vendor not found');

        if (isApproved) {
            vendor.status = VendorStatus.VERIFIED;
            vendor.isVerified = true;
            vendor.verifiedAt = new Date();
            vendor.verifiedBy = adminId;
        } else {
            vendor.status = VendorStatus.REJECTED;
        }

        return this.vendorRepository.save(vendor);
    }
}
