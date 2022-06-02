const path = require('path');

const { createAndRunPostgresDatabase } = require('server/database');

const setupLocalDatabase = async () => {
	console.log('ahoy');
	return createAndRunPostgresDatabase({
		username: 'pubpubdbadmin',
		password: 'pubpub-db-password',
		dbName: 'pubpub-localdb',
		dbPath: path.join(process.cwd(), 'pubpub-localdb'),
		drop: false,
	});
};

module.exports = { setupLocalDatabase };
