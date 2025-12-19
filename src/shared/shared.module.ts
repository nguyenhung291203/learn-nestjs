import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'

const shared = [PrismaService]
@Global()
@Module({
	providers: shared,
	exports: shared,
})
export class SharedModule {}
