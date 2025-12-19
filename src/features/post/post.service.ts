import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/shared/prisma/prisma.service'

@Injectable()
export class PostService {
	constructor(private readonly prismaService: PrismaService) {}
	getPosts() {
		return this.prismaService.post.findMany()
	}
}
