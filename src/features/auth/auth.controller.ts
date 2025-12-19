import { Body, Controller, Post, SerializeOptions } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, RegisterResponseDto } from './dto/register.dto'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@SerializeOptions({ type: RegisterResponseDto })
	@Post('/register')
	async register(@Body() dto: RegisterDto) {
		const res = await this.authService.register(dto)
		return res
	}
}
