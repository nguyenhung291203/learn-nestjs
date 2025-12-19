import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { PostModule } from './features/post/post.module'
import './shared/config'
import { AuthModule } from './features/auth/auth.module'
const features = [PostModule, AuthModule]
@Module({
	imports: [SharedModule, ...features],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
