import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(3)
	username: string;

	@Field()
	@IsString()
	@IsNotEmpty()
	@MinLength(8)
	password: string;
}
