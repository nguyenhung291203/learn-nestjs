import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common'
import { PostService } from './post.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { Auth } from 'src/shared/decorators/auth.decorator'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import * as jwtType from 'src/shared/types/jwt.type'

@Controller('posts')
@UseGuards(AuthenticationGuard)
export class PostController {
	constructor(private readonly postService: PostService) {}
	@Get()
	@Auth([AuthType.Bearer, AuthType.ApiKey], { condition: ConditionGuard.Or })
	getPosts() {
		return this.postService.getPosts()
	}

	@Get(':id')
	getPost(@Param('id', ParseIntPipe) id: number) {
		return this.postService.getPostById(id)
	}

	@Post()
	@Auth([AuthType.Bearer], { condition: ConditionGuard.And })
	createPost(@Body() dto: CreatePostDto, @ActiveUser() user: jwtType.TokenPayload) {
		console.log('user', user)
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
