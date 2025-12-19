import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { PostModule } from './features/post/post.module'
import { ConfigModule } from '@nestjs/config'
import './shared/config'
import { AuthModule } from './features/auth/auth.module'
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: `${process.cwd()}/.env`,
		}),
		SharedModule,
		PostModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
