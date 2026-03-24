import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class FiltersInput {
	@Field({ nullable: true })
	search?: string;

	@Field(() => Boolean, { nullable: true })
	onlySubscriptions?: boolean;
}
