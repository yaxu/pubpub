import {expect} from 'chai';
import {shallowRender} from 'tests/helpersClient';
import {JrnlProfileAbout} from './JrnlProfileAbout.jsx'

describe('Components', () => {
	describe('JrnlProfileAbout.jsx', () => {

		it('should render with empty props', () => {
			const props = {};
			const {renderOutput, error} = shallowRender(JrnlProfileAbout, props) ;

			expect(error).to.not.exist; // Did not render an error
			expect(renderOutput).to.exist; // Successfully rendered
			
		});

	});
});
