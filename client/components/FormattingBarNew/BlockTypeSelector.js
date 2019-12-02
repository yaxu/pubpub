import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import { Menu, MenuItem } from 'components/Menu';

const propTypes = {
	editorChangeObject: PropTypes.shape({
		menuItems: PropTypes.arrayOf(PropTypes.shape({})),
		view: PropTypes.shape({
			focus: PropTypes.func,
		}),
	}).isRequired,
};

const blockTypes = [
	{ key: 'paragraph', title: 'Paragraph', shortTitle: 'Para', icon: 'git-merge' },
	{ key: 'header1', title: 'Header 1', shortTitle: 'H1', icon: 'header-one' },
	{ key: 'header2', title: 'Header 2', shortTitle: 'H2', icon: 'header-two' },
	{ key: 'header3', title: 'Header 3', shortTitle: 'H3', icon: 'comparison' },
	{
		key: 'header4',
		title: 'Header 4',
		shortTitle: 'H4',
		icon: 'comparison',
		hideInMenu: true,
	},
	{
		key: 'header5',
		title: 'Header 5',
		shortTitle: 'H5',
		icon: 'comparison',
		hideInMenu: true,
	},
	{
		key: 'header6',
		title: 'Header 6',
		shortTitle: 'H6',
		icon: 'comparison',
		hideInMenu: true,
	},
	{ key: 'code_block', title: 'Code Block', shortTitle: 'Code', icon: 'code' },
];

const BlockTypeSelector = React.forwardRef((props, ref) => {
	const {
		editorChangeObject: { menuItems, view: editorView },
		...restProps
	} = props;

	const renderButtonContent = () => {
		const activeMenuItem = menuItems.find((item) => item.isActive);
		const activeBlockType =
			activeMenuItem &&
			blockTypes.find((blockType) => blockType.key === activeMenuItem.title);
		if (activeBlockType) {
			return (
				<span>
					<span className="full-title">{activeBlockType.title}</span>
					<span className="short-title">{activeBlockType.shortTitle}</span>
				</span>
			);
		}
		return null;
	};

	// eslint-disable-next-line react/prop-types
	const renderDisclosure = ({ ref: innerRef, ...disclosureProps }) => {
		return (
			<Button minimal rightIcon="caret-down" elementRef={innerRef} {...disclosureProps}>
				{renderButtonContent()}
			</Button>
		);
	};

	return (
		<Menu
			aria-label="Choose text formatting"
			ref={ref}
			{...restProps}
			disclosure={renderDisclosure}
		>
			{blockTypes
				.filter((blockType) => !blockType.hideInMenu)
				.map((blockType) => {
					const menuItem = menuItems.find((item) => item.title === blockType.key);
					return (
						<MenuItem
							key={blockType.key}
							active={menuItem.isActive}
							text={blockType.title}
							onClick={() => {
								menuItem.run();
								editorView.focus();
							}}
						/>
					);
				})}
		</Menu>
	);
});
BlockTypeSelector.propTypes = propTypes;
export default BlockTypeSelector;
