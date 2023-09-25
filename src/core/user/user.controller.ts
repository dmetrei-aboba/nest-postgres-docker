import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { GetUsersDto, PutUserDto } from './user.dto';
import { OkRes } from 'consts';
import { CommonError } from 'common';
import { AuthRequest } from 'interfaces';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User (Authorization required)')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Get current user data' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @Get()
  async getUser(@Req() req: AuthRequest) {
    return this.userService.getUserById(req.user.id);
  }

  @Put()
  async updateUser(@Req() req: AuthRequest, @Body() body: PutUserDto) {
    if (!body.email && !body.phone)
      throw new CommonError({ message: 'email or phone should be provided' });

    const id = req.user.id;

    return this.userService.updateUser({ ...body, id });
  }

  @Delete()
  async deleteUser(@Req() req: AuthRequest) {
    const id = req.user.id;
    await this.userService.deleteUser(id);

    return OkRes;
  }

  @Get('/getAll')
  async getUsers(@Query() query: GetUsersDto) {
    return this.userService.getUsers(query);
  }
}
