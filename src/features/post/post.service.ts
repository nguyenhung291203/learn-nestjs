import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from 'src/shared/services/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Injectable()
export class PostService {
	constructor(private readonly prisma: PrismaService) {}

	getPosts() {
		return this.prisma.post.findMany({
			include: {
				author: true,
			},
		})
	}

	async getPostById(id: number) {
		const post = await this.prisma.post.findUnique({
			where: { id },
			include: { author: true },
		})

		if (!post) {
			throw new NotFoundException('Post not found')
		}

		return post
	}

	createPost(dto: CreatePostDto) {
		return this.prisma.post.create({
			data: {
				title: dto.title,
				content: dto.content,
				published: dto.published ?? false,
				authorId: dto.authorId,
			},
		})
	}

	async updatePost(id: number, dto: UpdatePostDto) {
		await this.getPostById(id)

		return this.prisma.post.update({
			where: { id },
			data: dto,
		})
	}

	async deletePost(id: number) {
		await this.getPostById(id)
		return this.prisma.post.delete({
			where: { id },
		})
	}
}
