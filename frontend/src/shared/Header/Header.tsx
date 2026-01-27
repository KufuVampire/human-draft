import { ThemeSwitcher, UserProfile } from '@/modules';
import { BurgerMenu, Container, Logo } from '@/shared';

export const Header = () => {
	return (
		<header className='w-full py-4 shadow fixed top-0 z-header bg-layout flex items-center'>
			<Container className='flex justify-between items-center'>
				<Logo />
				<div className='flex items-center gap-x-6'>
					<ThemeSwitcher />
					<UserProfile />
					<BurgerMenu className='md:hidden' />
				</div>
			</Container>
		</header>
	);
};
