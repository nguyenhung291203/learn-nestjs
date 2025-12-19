export class LoginReqDto {
	email: string
	password: string
}

export class LoginResDto {
	accessToken: string
	refreshToken: string
}
