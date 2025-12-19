import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { UnprocessableEntityException, ValidationPipe } from '@nestjs/common'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
			exceptionFactory: (errors) => {
				const messages = errors.map((err) => ({
					field: err.property,
					errors: Object.values(err.constraints as any).join(', '),
				}))
				return new UnprocessableEntityException(messages)
			},
		}),
	)

	await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
