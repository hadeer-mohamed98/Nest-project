import {
  Controller,
  Get,
  Headers,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth, RoleEnum, StorageEnum, User } from 'src/common';
import type { HUserDocument } from 'src/DB';
import { PreferredLanguageInterceptor } from 'src/common/interceptors';
import { delay, Observable, of } from 'rxjs';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { localFileUpload } from 'src/common/utils/multer/local.multer.options';
import type { IMulterFile } from '../../common/interfaces';
import { cloudFileUpload, fileValidation } from 'src/common/utils/multer';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseInterceptors(PreferredLanguageInterceptor)
  @Auth([RoleEnum.admin, RoleEnum.user])
  @Get()
  profile(
    @Headers() header: any,
    @User() user: HUserDocument,
  ): Observable<any> {
    return of([{ message: 'Done' }]).pipe(delay(200));
  }

  @UseInterceptors(
    FileInterceptor(
      'profileImage',
      cloudFileUpload({
        storageApproach: StorageEnum.disk,
        validation: fileValidation.image,
        fileSize: 2,
      }),
    ),
  )
  @Auth([RoleEnum.user])
  @Patch('profile-image')
  async profileImage(
    @User() user: HUserDocument,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    const url = await this.userService.profilImage(file, user);
    return { message: 'Done', data: { url } };
  }

  // @UseInterceptors(
  //   FilesInterceptor(
  //     'coverImages',
  //     2,
  //     localFileUpload({
  //       folder: 'User',
  //       validation: fileValidation.image,
  //       fileSize: 2,
  //     }),
  //   ),
  // )
  // @Auth([RoleEnum.user])
  // @Patch('cover-images')
  // coverImage(
  //   @UploadedFiles(
  //     new ParseFilePipe({
  //       validators: [new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 })],
  //       fileIsRequired: true,
  //     }),
  //   )
  //   files: Array<IMulterFile>,
  // ) {
  //   return { message: 'Done', files };
  // }
}
