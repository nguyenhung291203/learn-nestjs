import { Exclude } from 'class-transformer'
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator'

export class RegisterDto {
	@IsEmail()
	email: string

	@MinLength(6)
	password: string

	@IsNotEmpty()
	name: string
}

export class RegisterResponseDto {
	id: number
	email: string
	name: string
	@Exclude() password: string
	@Exclude() createdAt: Date
	@Exclude() updatedAt: Date
	constructor(partial: Partial<RegisterResponseDto>) {
		Object.assign(this, partial)
	}
}
