export class RoutesConfig {
	home = '/';

	private blog = 'blog';
	private post = 'post';

	private create = 'create';
	private edit = 'edit';

	signin = '/sign-in';
	signup = '/sign-up';

	users = 'users';
	profile = 'profile';
	settings = 'settings';
	logout = 'logout';

	privacyPolicy = 'privacy-policy';
	publicOffer = 'public-offer';
	aboutUs = 'about-us';

	notFound = '/404';

	postCreate = () => `/${this.post}/${this.create}`;
	postUpdate = (id: number) => `/${this.post}/${id}/${this.edit}`;
	postById = (id: number) => `/${this.post}/${id}`;

	blogCreate = () => `/${this.blog}/${this.create}`;
	blogUpdate = (id: number) => `/${this.blog}/${id}/${this.edit}`;
	blogById = (id: number) => `/${this.blog}/${id}`;
}

export const routesConfig = new RoutesConfig();
