export class RoutesConfig {
	home = '/';

	private blog = '/blog';
	private post = '/post';

	private create = 'create';
	private update = 'update';

	signin = '/sign-in';
	signup = '/sign-up';
	users = '/users';
	profile = '/profile';
	settings = 'settings';
	logout = 'logout';

	privacyPolicy = 'privacy-policy';
	publicOffer = 'public-offer';
	aboutUs = 'about-us';

	notFound = '404';

	postCreate = () => `${this.post}/${this.create}`;
	postUpdate = (id: string) => `${this.post}/${id}/${this.update}`;
	postById = (id: string) => `${this.post}/${id}`;

	blogCreate = () => `${this.blog}/${this.create}`;
	blogUpdate = (id: string) => `${this.blog}/${id}/${this.update}`;
	blogById = (id: string) => `${this.blog}/${id}`;
}

export const routesConfig = new RoutesConfig();
