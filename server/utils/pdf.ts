import htmlPdf from 'html-pdf';

const getBoundPrecursorMethods = (res, keys) => {
	const methods: Record<string, any> = {};
	keys.forEach((key) => {
		methods[key] = res[key].bind(res);
	});
	return methods;
};

const modifyResponseToRenderAsPdf = (res) => {
	const { setHeader, write } = getBoundPrecursorMethods(res, ['setHeader', 'write']);
	let rewriteToPdf = false;

	res.setHeader = function (key, value) {
		if (key.toLowerCase() === 'content-type' && value.toLowerCase() === 'text/html') {
			rewriteToPdf = true;
			return setHeader(key, 'application/pdf');
		}
		return setHeader(key, value);
	};

	res.write = async function (value) {
		if (rewriteToPdf) {
			return htmlPdf.create(value).toBuffer((err, buffer) => {
				write(buffer, 'binary');
				res.end(null, 'binary');
			});
		}
		return write(value);
	};
};

export const cursedPdfMiddleware = (req, res, next) => {
	const { pdf: togglePdf } = req.query;
	if (togglePdf) {
		const toggleValue = !!+togglePdf;
		req.session.pdf = toggleValue;
	}
	if (process.env.CURSED_PDF_MODE) {
		req.session.pdf = true;
	}
	const { pdf: renderAsPdf } = req.session;
	if (renderAsPdf) {
		modifyResponseToRenderAsPdf(res);
	}
	next();
};
