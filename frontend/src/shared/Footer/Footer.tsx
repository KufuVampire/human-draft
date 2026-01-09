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
		<footer className='bg-layout min-h-[15.75rem]'>
			<Container className='flex flex-col justify-between items-center py-6 md:py-12'>
				<div className='flex justify-between items-center border-b border-footer-bottom pb-8 gap-y-6 w-full flex-col-reverse md:flex-row'>
					<div className='flex flex-col gap-y-6 w-full items-center md:items-stretch'>
						<Navigation
							direction='row'
							variant='footer'
						/>
						{/* TODO: поменять ссылки, номер телефона, поставить соц-сети, придумать название для сайта */}
						<div className='flex flex-col md:flex-row gap-x-3 gap-y-6 w-full items-center md:items-stretch'>
							<div className='flex gap-x-3'>
								<a
									href='mailto:dmitrykertsman@mail.ru'
									className='text-secondary md:leading-6 leading-[1.125rem] text-xs font-light hover:text-primary-hover transition-colors'>
									{t('fields.email')}: dmitrykertsman@mail.ru
								</a>
							</div>
							<div className='text-secondary leading-6 flex gap-x-3 md:gap-x-2 justify-center md:justify-normal'>
								<div>Vk</div>
								<div>Tg</div>
								<div>GitHub</div>
							</div>
						</div>
					</div>
					<Logo />
				</div>
				<div className='flex justify-between items-center pt-8 w-full flex-col md:flex-row gap-y-2'>
					<div className='text-secondary font-light text-xs leading-[1.125rem]'>
						© {new Date().getFullYear()} HUMAN DRAFT
					</div>
					<nav>
						<ul className='flex gap-2 text-secondary flex-col md:flex-row'>
							{additionalNavigationItems.map(({ href, translationKey }) => (
								<li
									key={href}
									className='text-secondary md:pr-2 md:last:border-0 md:border-r md:border-secondary font-light text-xs leading-[1.125rem]'>
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
