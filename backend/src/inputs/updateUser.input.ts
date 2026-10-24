import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

@InputType()
export class UpdateUserInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@Length(3, 16)
	username?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@IsEmail()
	email?: string;

	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	@Length(0, 300)
	description?: string;
}
