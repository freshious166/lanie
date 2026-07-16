import {
    Injectable,
    NotFoundException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vendor, VendorStatus } from './entities/vendor.entity';
import { VendorService } from './entities/vendor-service.entity';
import { VendorReview } from './entities/vendor-review.entity';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorServiceDto } from './dto/create-vendor-service.dto';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class VendorsService {
    constructor(
        @InjectRepository(Vendor)
        private vendorsRepo: Repository<Vendor>,

        @InjectRepository(VendorService)
        private vendorServicesRepo: Repository<VendorService>,

        @InjectRepository(VendorReview)
        private reviewsRepo: Repository<VendorReview>,
    ) { }

    // ── VENDORS ───────────────────────────────────────────────────────────────

    async create(dto: CreateVendorDto, ownerId?: string): Promise<Vendor> {
        const existing = await this.vendorsRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException(`A vendor with email '${dto.email}' already exists.`);
        }

        const vendor = this.vendorsRepo.create({
            ...dto,
            ownerId,
            status: VendorStatus.PENDING,
        });

        return this.vendorsRepo.save(vendor);
    }

    async findAll(filters?: {
        state?: string;
        city?: string;
        category?: string;
        isVerified?: boolean;
        search?: string;
    }): Promise<Vendor[]> {
        const qb = this.vendorsRepo
            .createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.services', 'services')
            .where('vendor.status = :status', { status: VendorStatus.VERIFIED });

        if (filters?.state) {
            qb.andWhere('LOWER(vendor.state) = LOWER(:state)', { state: filters.state });
        }
        if (filters?.city) {
            qb.andWhere('LOWER(vendor.city) = LOWER(:city)', { city: filters.city });
        }
        if (filters?.category) {
            qb.andWhere('vendor.category = :category', { category: filters.category });
        }
        if (filters?.isVerified !== undefined) {
            qb.andWhere('vendor.isVerified = :isVerified', { isVerified: filters.isVerified });
        }
        if (filters?.search) {
            qb.andWhere(
                '(LOWER(vendor.businessName) LIKE LOWER(:q) OR LOWER(vendor.address) LIKE LOWER(:q) OR LOWER(vendor.city) LIKE LOWER(:q))',
                { q: `%${filters.search}%` },
            );
        }

        return qb.orderBy('vendor.averageRating', 'DESC').getMany();
    }

    async findNearby(lat: number, lng: number, radiusKm = 10): Promise<Vendor[]> {
        return this.vendorsRepo
            .createQueryBuilder('vendor')
            .leftJoinAndSelect('vendor.services', 'services')
            .where('vendor.status = :status', { status: VendorStatus.VERIFIED })
            .andWhere('vendor.location IS NOT NULL')
            .andWhere(
                'ST_DWithin(vendor.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography, :radiusMeters)',
            )
            .setParameters({ lat, lng, radiusMeters: radiusKm * 1000 })
            .orderBy('ST_Distance(vendor.location::geography, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography)', 'ASC')
            .getMany();
    }

    async findOne(id: string): Promise<Vendor> {
        const vendor = await this.vendorsRepo.findOne({
            where: { id },
            relations: ['services', 'reviews', 'reviews.reviewer', 'owner'],
        });
        if (!vendor) throw new NotFoundException(`Vendor ${id} not found`);
        return vendor;
    }

    async update(id: string, dto: UpdateVendorDto): Promise<Vendor> {
        await this.findOne(id); // Throws if not found
        await this.vendorsRepo.update(id, dto as any);
        return this.findOne(id);
    }

    async verify(id: string, adminId: string): Promise<Vendor> {
        const vendor = await this.findOne(id);
        vendor.status = VendorStatus.VERIFIED;
        vendor.isVerified = true;
        vendor.verifiedAt = new Date();
        vendor.verifiedBy = adminId;
        return this.vendorsRepo.save(vendor);
    }

    async suspend(id: string): Promise<Vendor> {
        const vendor = await this.findOne(id);
        vendor.status = VendorStatus.SUSPENDED;
        return this.vendorsRepo.save(vendor);
    }

    async remove(id: string): Promise<void> {
        const vendor = await this.findOne(id);
        await this.vendorsRepo.remove(vendor);
    }

    // ── VENDOR SERVICES ───────────────────────────────────────────────────────

    async addService(vendorId: string, dto: CreateVendorServiceDto): Promise<VendorService> {
        await this.findOne(vendorId);
        const svc = this.vendorServicesRepo.create({ ...dto, vendorId, priceCurrency: 'NGN' });
        return this.vendorServicesRepo.save(svc);
    }

    async removeService(vendorId: string, serviceId: string): Promise<void> {
        const svc = await this.vendorServicesRepo.findOne({
            where: { id: serviceId, vendorId },
        });
        if (!svc) throw new NotFoundException(`Service ${serviceId} not found for vendor ${vendorId}`);
        await this.vendorServicesRepo.remove(svc);
    }

    // ── REVIEWS ───────────────────────────────────────────────────────────────

    async addReview(
        vendorId: string,
        reviewerId: string,
        dto: CreateReviewDto,
    ): Promise<VendorReview> {
        if (dto.rating < 1 || dto.rating > 5) {
            throw new BadRequestException('Rating must be between 1 and 5');
        }

        const vendor = await this.findOne(vendorId);

        const review = this.reviewsRepo.create({
            vendorId,
            reviewerId,
            rating: dto.rating,
            comment: dto.comment,
        });
        await this.reviewsRepo.save(review);

        // Recalculate denormalized rating
        const { avg, count } = await this.reviewsRepo
            .createQueryBuilder('r')
            .select('AVG(r.rating)', 'avg')
            .addSelect('COUNT(*)', 'count')
            .where('r.vendorId = :vendorId', { vendorId })
            .getRawOne();

        vendor.averageRating = parseFloat(parseFloat(avg).toFixed(2));
        vendor.totalReviews = parseInt(count, 10);
        await this.vendorsRepo.save(vendor);

        return review;
    }

    async getReviews(vendorId: string): Promise<VendorReview[]> {
        return this.reviewsRepo.find({
            where: { vendorId },
            relations: ['reviewer'],
            order: { createdAt: 'DESC' },
        });
    }
}
