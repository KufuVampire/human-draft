import { Skeleton } from '../Skeleton';
import { UserAvatarSkeleton } from '../UserAvatarSkeleton';

const arr = new Array(3).fill(0);

export const SettingsPageSkeleton = () => {
	return (
		<div className='bg-[var(--background-color-card)] transition-colors w-full px-2 py-6 md:px-6 rounded-xl flex flex-col md:gap-y-12 gap-y-6'>
			<Skeleton className='w-full lg:w-[54%] h-13 rounded-xl' />
			<div className='flex flex-col md:flex-row gap-6 items-center'>
				<div className='size-42.5 rounded-full bg-[var(--background-color-card)] transition-colors md:self-start shrink-0'>
					<UserAvatarSkeleton location='settings-page' />
				</div>
				<ul className='flex flex-col gap-y-5 w-full'>
					{arr.map((_, index) => (
						<li
							className='w-full flex flex-col gap-y-2'
							key={index}>
							<Skeleton className='w-60 h-7 rounded-xl' />
							<Skeleton className='w-full h-12.5 rounded-xl' />
						</li>
					))}
				</ul>
			</div>
			<Skeleton className='py-4 rounded-[0.625rem] h-14' />
		</div>
	);
};
