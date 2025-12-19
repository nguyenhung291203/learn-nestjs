import { plainToInstance } from 'class-transformer'
import { IsString, validateSync } from 'class-validator'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
config({
	path: '.env',
})
if (!fs.existsSync(path.resolve('.env'))) {
	console.warn('.env file is missing!')
	process.exit(1)
}

class ConfigSchema {
	@IsString()
	DATABASE_URL: string
}

const configServer = plainToInstance(ConfigSchema, process.env)
const e = validateSync(configServer)
if (e.length > 0) {
	console.error('error in validating .env file:')
	const errors = e.map((item) => ({
		property: item.property,
		constraints: item.constraints,
		value: item.value,
	}))
	throw errors
}
