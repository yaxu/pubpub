import app, { wrap } from 'server/server';
import { setLocalCommunity } from 'server/utils/localhost';

app.get(
	'/local/setCommunity/:subdomain',
	wrap(async (req, res) => {
		try {
			const { subdomain } = req.params;
			await setLocalCommunity(req, subdomain);
			return res.redirect('/');
		} catch (err) {
			return res.status(500).end();
		}
	}),
);
