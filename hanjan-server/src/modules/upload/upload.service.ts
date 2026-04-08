import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { nanoid } from 'nanoid';

@Injectable()
export class UploadService {
    private s3Client: S3Client;

    constructor(private configService: ConfigService) {
        this.s3Client = new S3Client({
            region: this.configService.get('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
            },
        });
    }

    async uploadFile(file: any, folder: string): Promise<string> {
        // Dummy upload for local development if AWS keys not provided
        if (!this.configService.get('AWS_ACCESS_KEY_ID')) {
            return `https://dummy-bucket.s3.amazonaws.com/${folder}/${nanoid()}.jpg`;
        }

        const key = `${folder}/${nanoid()}-${file.originalname}`;
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.configService.get('AWS_S3_BUCKET'),
                Key: key,
                Body: file.buffer,
                ContentType: file.mimetype,
            }),
        );

        return `https://${this.configService.get('AWS_S3_BUCKET')}.s3.amazonaws.com/${key}`;
    }
}
