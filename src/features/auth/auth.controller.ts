import { Body, Controller, Post, SerializeOptions, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterDto, RegisterResponseDto } from './dto/register.dto'
import { LoginReqDto } from './dto/login.dto'
import { RefreshTokenDto } from './dto/refresh-token.dto'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Controller('auth')
@UseGuards(AuthenticationGuard)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@SerializeOptions({ type: RegisterResponseDto })
	@Post('/register')
	async register(@Body() dto: RegisterDto) {
		const res = await this.authService.register(dto)
		return res
	}

	@Post('/login')
	async login(@Body() req: LoginReqDto) {
		const res = this.authService.login(req)
		return res
	}

	@Post('refresh')
	refresh(@Body() dto: RefreshTokenDto) {
		return this.authService.refresh(dto.refreshToken)
	}

	@Post('/logout')
	@Auth([AuthType.Bearer], { condition: ConditionGuard.And })
	async logout(@Body() dto: RefreshTokenDto) {
		await this.authService.logout(dto.refreshToken)
		return { message: 'Logout successful' }
	}
}
