'use client';

import { useTranslations } from 'next-intl';

import { routesConfig } from '@/config';
import { Container, CustomLink, Logo, Navigation } from '@/shared';

const additionalNavigationItems = [
	{
		href: routesConfig.aboutUs,
		translationKey: 'navigation.aboutUs',
	},
	{
		href: routesConfig.privacyPolicy,
		translationKey: 'navigation.privacyPolicy',
	},
	{
		href: routesConfig.publicOffer,
		translationKey: 'navigation.publicOffer',
	},
];

export const Footer = () => {
	const t = useTranslations();

	return (
		<footer className='bg-surface-card border-t border-border-subtle min-h-64 mt-auto transition-colors'>
			<Container className='flex flex-col justify-between items-center py-8 md:py-12 gap-y-6'>
				<div className='flex justify-between items-center border-b border-border-subtle pb-8 gap-y-6 w-full flex-col-reverse md:flex-row'>
					<div className='flex flex-col gap-y-6 w-full items-center md:items-stretch'>
						<Navigation
							direction='row'
							variant='footer'
						/>
						<div className='flex flex-col md:flex-row gap-x-6 gap-y-3 w-full items-center md:items-stretch'>
							<div className='flex gap-x-3'>
								<a
									href='mailto:dmitrykertsman@mail.ru'
									className='text-muted text-xs hover:text-primary transition-colors'>
									{t('fields.email')}: dmitrykertsman@mail.ru
								</a>
							</div>
							<div className='text-muted text-xs flex gap-x-4 justify-center md:justify-normal'>
								<span className='hover:text-primary cursor-pointer transition-colors'>Vk</span>
								<span className='hover:text-primary cursor-pointer transition-colors'>Tg</span>
								<span className='hover:text-primary cursor-pointer transition-colors'>GitHub</span>
							</div>
						</div>
					</div>
					<Logo />
				</div>
				<div className='flex justify-between items-center pt-2 w-full flex-col md:flex-row gap-y-3 text-muted text-xs'>
					<div>
						© {new Date().getFullYear()} HUMAN DRAFT
					</div>
					<nav>
						<ul className='flex gap-3 flex-col md:flex-row items-center'>
							{additionalNavigationItems.map(({ href, translationKey }) => (
								<li
									key={href}
									className='md:pr-3 md:last:border-0 md:border-r md:border-border-subtle hover:text-primary transition-colors'>
									<CustomLink href={href}>{t(translationKey)}</CustomLink>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</Container>
		</footer>
	);
};
