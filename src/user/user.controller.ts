import { ClassSerializerInterceptor, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { UserService } from './user.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService){}

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    async getAllUsers(){
        return this.userService.findAllUsers();
    }
}
