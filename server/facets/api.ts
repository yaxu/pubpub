import app, { wrap } from 'server/server';

import { getScopeId } from '../../facets/lib/scopes';
import { updateFacetsForScope } from './update';

app.post(
	'/api/facets',
	wrap(async (req, res) => {
		const { facets, scope } = req.body;
		await updateFacetsForScope(getScopeId(scope), facets);
		return res.status(200).json({});
	}),
);
