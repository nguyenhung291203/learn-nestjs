import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
	UnprocessableEntityException,
} from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { HashingService } from 'src/shared/services/hashing.service'
import { LoginReqDto, LoginResDto } from './dto/login.dto'
import { TokenService } from 'src/shared/services/token.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly hashingService: HashingService,
		private readonly tokenService: TokenService,
	) {}

	async register(dto: RegisterDto) {
		const existed = await this.prismaService.user.findUnique({
			where: { email: dto.email },
		})

		if (existed) {
			throw new BadRequestException('Email already exists')
		}

		const hashed = await this.hashingService.hash(dto.password)

		return this.prismaService.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				password: hashed,
			},
		})
	}
	async login(req: LoginReqDto): Promise<LoginResDto> {
		const user = await this.prismaService.user.findUnique({
			where: { email: req.email },
		})

		if (!user) {
			throw new UnauthorizedException('User not exists')
		}
		const isPasswordValid = await this.hashingService.compare(req.password, user.password)

		if (!isPasswordValid) {
			throw new UnprocessableEntityException({
				field: 'password',
				message: 'Password is incorrect',
			})
		}
		const tokens = this.generateTokens({ userId: user.id })
		const payload = this.tokenService.verifyRefreshToken(tokens.refreshToken)

		await this.prismaService.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				userId: user.id,
				expiresAt: new Date(payload.exp! * 1000),
			},
		})
		return tokens
	}

	async refresh(refreshToken: string): Promise<LoginResDto> {
		const { userId } = this.tokenService.verifyRefreshToken(refreshToken)

		const storedToken = await this.prismaService.refreshToken.findUnique({
			where: { token: refreshToken },
		})

		if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
			throw new UnauthorizedException('Refresh token invalid')
		}

		await this.prismaService.refreshToken.update({
			where: { token: refreshToken },
			data: { revoked: true },
		})

		const tokens = this.generateTokens({ userId: userId })

		const newPayload = this.tokenService.verifyRefreshToken(tokens.refreshToken)

		await this.prismaService.refreshToken.create({
			data: {
				token: tokens.refreshToken,
				userId: userId,
				expiresAt: new Date(newPayload.exp! * 1000),
			},
		})

		return tokens
	}

	private generateTokens(payload: { userId: number }): LoginResDto {
		return {
			accessToken: this.tokenService.signAccessToken(payload),
			refreshToken: this.tokenService.signRefreshToken(payload),
		}
	}
}
