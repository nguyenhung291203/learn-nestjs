import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { TokenService } from '../services/token.service'
import { configServer } from '../config'

@Injectable()
export class APIKeyGuard implements CanActivate {
	constructor(private readonly tokenService: TokenService) {}
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const request = context.switchToHttp().getRequest()
		const xAPIKey = request.headers['x-api-key']
		if (xAPIKey !== configServer.SECRET_API_KEY) {
			throw new UnauthorizedException()
		}
		return true
	}
}
