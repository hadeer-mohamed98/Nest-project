import { Controller, Get, Headers, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { Auth, IUser, RoleEnum, User } from 'src/common';
import type { HUserDocument } from 'src/DB';
import { PreferredLanguageInterceptor } from 'src/common/interceptors';
import { delay, Observable, of } from 'rxjs';

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

  @Get()
  allUsers(): { message: string; data: { users: IUser[] } } {
    const users: IUser[] = this.userService.allUsers();
    return { message: 'Done', data: { users } };
  }
}
