import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadService {
  async uploadSelfie(base64: string): Promise<{ url: string }> {
    const url = `https://placeholder.hanjan.app/selfies/${Date.now()}.jpg`;
    return { url };
  }

  async uploadIdCard(base64: string): Promise<{ url: string }> {
    const url = `https://placeholder.hanjan.app/id-cards/${Date.now()}.jpg`;
    return { url };
  }
}
