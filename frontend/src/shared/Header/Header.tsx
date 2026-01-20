import { UserModel } from '@/graphql/generated/output';
import { ThemeSwitcher, UserProfile } from '@/modules';
import { BurgerMenu, Container, Logo } from '@/shared';

interface Props {
	userProfile: UserModel | null;
}

export const Header = ({ userProfile }: Props) => {
	return (
		<header className='w-full py-4 shadow fixed top-0 z-[var(--z-header)] bg-layout flex items-center'>
			<Container className='flex justify-between items-center'>
				<Logo />
				<div className='flex items-center gap-x-6'>
					<ThemeSwitcher />
					<UserProfile userProfile={userProfile} />
					<BurgerMenu className='md:hidden' />
				</div>
			</Container>
		</header>
	);
};
