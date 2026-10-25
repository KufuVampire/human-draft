import { Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

@InputType()
export class FiltersInput {
	@Field({ nullable: true })
	@IsOptional()
	@IsString()
	search?: string;

	@Field(() => Boolean, { nullable: true })
	@IsOptional()
	@IsBoolean()
	onlySubscriptions?: boolean;
}
