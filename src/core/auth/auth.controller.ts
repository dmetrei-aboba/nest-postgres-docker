import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { SignInDto, SignUpDto } from './auth.dto';
import { AuthService } from './auth.service';
import { CommonError } from 'common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User already exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiOperation({ summary: 'create new user and get Bearer token' })
  @Post('signUp')
  async signUp(@Body() body: SignUpDto) {
    if (body.email === undefined && body.phone === undefined)
      throw new CommonError({ message: 'email or phone should be provided' });

    return this.authService.signUp(body);
  }

  @ApiResponse({ status: HttpStatus.CREATED, description: 'Success' })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User already exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
  })
  @ApiOperation({ summary: 'get Bearer token' })
  @Post('signIn')
  signIn(@Body() body: SignInDto) {
    if (body.email === undefined && body.phone === undefined)
      throw new CommonError({ message: 'email or phone should be provided' });

    return this.authService.signIn(body);
  }
}
