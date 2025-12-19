import { Global, Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { HashingService } from './hashing/hashing.service'

const shared = [PrismaService, HashingService]
@Global()
@Module({
	providers: shared,
	exports: shared,
})
export class SharedModule {}
