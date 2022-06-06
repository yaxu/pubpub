/* eslint-disable global-require */
const {
	argv: { watch },
} = require('yargs');
const throng = require('throng');
const path = require('path');

const { setupLocalDatabase } = require('./localDatabase');

const watchables = watch && (Array.isArray(watch) ? watch : [watch]).filter((x) => x);

const main = async () => {
	if (process.env.NODE_ENV !== 'production' && process.env.USE_LOCAL_DB) {
		process.env.DATABASE_URL = await setupLocalDatabase();
	} else {
		console.log('not cool!!!');
	}

	if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
		require(path.join(process.cwd(), 'config.js'));
	}

	if (process.env.NODE_ENV === 'production') {
		require('newrelic');
	}

	throng({ workers: 1, lifetime: Infinity }, () => {
		const loadServer = () => {
			return require('./dist/server/server/server').startServer();
		};

		if (watchables) {
			const hotReloadServer = require('./hotReloadServer');
			hotReloadServer(loadServer, watchables);
		} else {
			loadServer();
		}
	});
};

main();
