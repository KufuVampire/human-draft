import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction } from 'react';
import { UseFormRegister } from 'react-hook-form';

import { TypeHomePageSearchSchema } from '@/schemas';
import { Dropdown, FormField } from '@/shared';
import { cn } from '@/utils';

interface Props {
	search: string;
	register: UseFormRegister<TypeHomePageSearchSchema>;
	dropdownSearchItems: React.ReactNode[];
	isDropdownSearchOpen: boolean;
	setDropdownSearchOpen: Dispatch<SetStateAction<boolean>>;
	isSearchOpenOnMobile: boolean;
	setSearchOpenOnMobile: Dispatch<SetStateAction<boolean>>;
}

export const HomePageSearchBar = ({
	search,
	register,
	dropdownSearchItems,
	isDropdownSearchOpen,
	setDropdownSearchOpen,
	isSearchOpenOnMobile,
	setSearchOpenOnMobile,
}: Props) => {
	const t = useTranslations();

	return (
		<Dropdown
			isOpen={isDropdownSearchOpen}
			setOpen={(value) => {
				const next =
					typeof value === 'function' ? value(isDropdownSearchOpen) : value;
				setDropdownSearchOpen(next);
				if (!next) {
					setSearchOpenOnMobile(false);
				}
			}}
			className={cn(
				'w-full',
				isSearchOpenOnMobile && 'absolute top-3 z-10 sm:static'
			)}
			listClassName='w-full shadow-lg border border-border-subtle bg-surface-card'
			itemClassName='border-b border-border-subtle last:border-b-0'
			items={dropdownSearchItems}>
			<FormField
				className='w-full p-0 border-none outline-none text-sm md:text-base'
				wrapperClassNames='w-full'
				inputWrapperClassName='bg-surface-card border border-border-subtle shadow-xs hover:border-primary/50 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all py-3 px-4 flex items-center gap-x-3 rounded-xl'
				placeholder={t('fields.searchInput')}
				{...register('search')}
				onFocus={() => {
					if (search.length >= 3 && dropdownSearchItems.length > 0) {
						setDropdownSearchOpen(true);
					}
					setSearchOpenOnMobile(true);
				}}>
				<Search className='size-5 text-muted shrink-0' />
			</FormField>
		</Dropdown>
	);
};
