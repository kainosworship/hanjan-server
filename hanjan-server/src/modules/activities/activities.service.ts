import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../providers/prisma.service';
import { addHours } from 'date-fns';

@Injectable()
export class ActivitiesService {
    constructor(private prisma: PrismaService) { }

    async createActivity(userId: string, data: any) {
        // Basic validation
        if (!data.category || !data.locationLat || !data.locationLng) {
            throw new BadRequestException('Missing required fields');
        }

        // Determine expiry time (e.g., 4 hours default or based on timing)
        const expiresAt = addHours(new Date(), 4);

        return this.prisma.activity.create({
            data: {
                userId,
                category: data.category,
                timing: data.timing || 'NOW',
                scheduledAt: data.scheduledAt ? new Date(data.scheduledAt) : new Date(),
                radiusKm: data.radiusKm || 2,
                groupSize: data.groupSize || 'ONE_ON_ONE',
                message: data.message,
                locationLat: data.locationLat,
                locationLng: data.locationLng,
                expiresAt,
            },
        });
    }

    async getNearbyActivities(lat: number, lng: number, radiusKm: number = 5) {
        // Use raw query for PostGIS distance filtering if available,
        // otherwise fallback to simple box query for MVP performance

        // Fallback simple query (bounding box)
        const latDelta = radiusKm / 111;
        const lngDelta = radiusKm / (111 * Math.cos(lat * (Math.PI / 180)));

        return this.prisma.activity.findMany({
            where: {
                status: 'ACTIVE',
                locationLat: { gte: lat - latDelta, lte: lat + latDelta },
                locationLng: { gte: lng - lngDelta, lte: lng + lngDelta },
                expiresAt: { gte: new Date() },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        nickname: true,
                        profileImageUrl: true,
                        gender: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getActivityById(id: string) {
        return this.prisma.activity.findUnique({
            where: { id },
            include: { user: true },
        });
    }
}
