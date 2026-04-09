import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('selfie')
  uploadSelfie(@Body() body: { base64: string }) {
    return this.uploadService.uploadSelfie(body.base64);
  }

  @Post('id-card')
  uploadIdCard(@Body() body: { base64: string }) {
    return this.uploadService.uploadIdCard(body.base64);
  }
}
