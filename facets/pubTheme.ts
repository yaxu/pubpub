import { facet } from './lib';

export const pubTheme = facet({
	name: 'pubTheme',
	intrinsic: true,
	props: ({ string, url, stringEnum }) => ({
		headerBackgroundColor: string,
		headerBackgroundImage: url,
		headerStyle: stringEnum(['white-blocks', 'black-blocks', 'dark', 'light']),
	}),
	driver: ({ table }) => table('PubTheme'),
});
