import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

@Controller('posts')
export class PostController {
	constructor(private readonly postService: PostService) {}
	@Get()
	getPosts() {
		return this.postService.getPosts()
	}

	@Get(':id')
	getPost(@Param('id', ParseIntPipe) id: number) {
		return this.postService.getPostById(id)
	}

	@Post()
	createPost(@Body() dto: CreatePostDto) {
		return this.postService.createPost(dto)
	}

	@Patch(':id')
	updatePost(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePostDto) {
		return this.postService.updatePost(id, dto)
	}

	@Delete(':id')
	deletePost(@Param('id', ParseIntPipe) id: number) {
		return this.postService.deletePost(id)
	}
}
