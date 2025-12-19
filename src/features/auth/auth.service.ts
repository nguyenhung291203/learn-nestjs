import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'
import { RegisterDto } from './dto/register.dto'
import { HashingService } from 'src/shared/hashing/hashing.service'

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly hashingService: HashingService,
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
			select: {
				id: true,
				email: true,
				name: true,
			},
		})
	}
}
