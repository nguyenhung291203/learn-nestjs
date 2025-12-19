import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { PostModule } from './features/post/post.module'
import './shared/config'
import { AuthModule } from './features/auth/auth.module'
import { APP_INTERCEPTOR } from '@nestjs/core'
const features = [PostModule, AuthModule]
@Module({
	imports: [...features, SharedModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: ClassSerializerInterceptor,
		},
	],
})
export class AppModule {}
