import { S3Service } from './../../common/services/s3.service';
import { Injectable } from '@nestjs/common';
import { IUser, StorageEnum } from 'src/common';
import { HUserDocument } from 'src/DB';

@Injectable()
export class UserService {
  constructor(private readonly s3Service: S3Service) {}
  allUsers(): IUser[] {
    return [{ id: 2, username: 'mmvmf', email: 'dllld', password: 'mmcmvm' }];
  }

  async profilImage(
    file: Express.Multer.File,
    user: HUserDocument,
  ): Promise<string> {
    user.profilePicture = await this.s3Service.uploadFile({
      file,
      storageApproach:StorageEnum.disk,
      path: `user/${user._id.toString()}`,
    });
    await user.save();
    return user.profilePicture;
  }
}
