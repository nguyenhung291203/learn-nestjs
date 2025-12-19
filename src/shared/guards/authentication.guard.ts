import { AccessTokenGuard } from 'src/shared/guards/acces-token.guard'
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AUTH_TYPE_KEY } from '../decorators/auth.decorator'
import { APIKeyGuard } from './api-key.guard'
import { AuthType, AuthTypeDecoratorPayload, ConditionGuard } from '../constants/auth.constant'
import { Observable, lastValueFrom } from 'rxjs'

@Injectable()
export class AuthenticationGuard implements CanActivate {
	private readonly guardMap: Record<string, CanActivate>

	constructor(
		private readonly reflector: Reflector,
		private readonly accessTokenGuard: AccessTokenGuard,
		private readonly apiKeyGuard: APIKeyGuard,
	) {
		this.guardMap = {
			[AuthType.Bearer]: this.accessTokenGuard,
			[AuthType.ApiKey]: this.apiKeyGuard,
			[AuthType.None]: {
				canActivate: () => true,
			},
		}
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const authTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload>(
			AUTH_TYPE_KEY,
			[context.getHandler(), context.getClass()],
		) ?? {
			authTypes: [AuthType.None],
			options: { condition: ConditionGuard.And },
		}

		const guards = authTypeValue.authTypes.map((item) => this.guardMap[item])

		if (authTypeValue.options.condition === ConditionGuard.Or) {
			for (const guard of guards) {
				try {
					const result = guard.canActivate(context)
					const canActivate = await this.resolveGuardResult(result)
					if (canActivate) return true
				} catch (error) {
					console.log('Guard failed:', error.message)
					continue
				}
			}
			throw new UnauthorizedException('All guards failed')
		}

		if (authTypeValue.options.condition === ConditionGuard.And) {
			for (const guard of guards) {
				const result = guard.canActivate(context)
				const canActivate = await this.resolveGuardResult(result)
				if (!canActivate) {
					throw new UnauthorizedException()
				}
			}
			return true
		}

		return true
	}

	private async resolveGuardResult(
		result: boolean | Promise<boolean> | Observable<boolean>,
	): Promise<boolean> {
		if (result instanceof Observable) {
			return lastValueFrom(result)
		}
		return Promise.resolve(result)
	}
}
