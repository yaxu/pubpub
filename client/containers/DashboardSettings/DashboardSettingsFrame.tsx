import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useBeforeUnload, useUpdateEffect } from 'react-use';
import classNames from 'classnames';
import { Button, Tab, Tabs } from '@blueprintjs/core';

import { ScopeData } from 'types';
import { DashboardFrame, Icon, IconName, MobileAware, PendingChangesProvider } from 'components';
import { PubPubIconName } from 'client/utils/icons';
import { useFacetsState } from 'client/utils/useFacets';
import { usePageContext, usePendingChanges } from 'utils/hooks';
import { getDashUrl } from 'utils/dashboard';
import { useSticky } from 'client/utils/useSticky';
import { useViewport } from 'client/utils/useViewport';
import AutosaveIndicator from './AutosaveIndicator';

require('./dashboardSettingsFrame.scss');

type Section = React.ReactNode | (() => React.ReactNode);

export type Subtab = {
	id: string;
	title: string;
	hideSaveButton?: boolean;
	sections: Section[];
} & ({ icon: IconName } | { pubPubIcon: PubPubIconName });

type Props = {
	id: string;
	tabs: Subtab[];
	className?: string;
	hasChanges: boolean;
	persist: () => Promise<void>;
};

// Global header + breadcrumbs - 1px top border of OverviewRowSkeleton
const breadcrumbsOffset = 56 + 85 - 1;

const getSettingsUrl = (scopeData: ScopeData, subMode: undefined | string) => {
	const { activeTargetType, activeCollection, activePub } = scopeData.elements;
	if (activeTargetType === 'community') {
		return getDashUrl({ mode: 'settings', subMode });
	}
	if (activeTargetType === 'collection') {
		return getDashUrl({ mode: 'settings', collectionSlug: activeCollection!.slug, subMode });
	}
	if (activeTargetType === 'pub') {
		return getDashUrl({ mode: 'settings', pubSlug: activePub!.slug, subMode });
	}
};

const DashboardSettingsFrame = (props: Props) => {
	const {
		tabs,
		id,
		className,
		hasChanges: hasNonFacetsChanges,
		persist: persistNonFacets,
	} = props;
	const { isMobile } = useViewport();
	const { pendingCount } = usePendingChanges();
	const { locationData, scopeData } = usePageContext();
	const { hasPersistableChanges: hasFacetsChanges, persistFacets } = useFacetsState();
	const [mounted, setMounted] = useState(false);
	const [isPersisting, setIsPersisting] = useState(false);
	const stickyControlsRef = useRef<null | HTMLDivElement>(null);
	const hasChanges = hasNonFacetsChanges || hasFacetsChanges;

	const [currentTabId, setCurrentTabId] = useState(() => {
		const { subMode } = locationData.params;
		if (tabs.some((tab) => tab.id === subMode)) {
			return subMode;
		}
		return tabs[0].id;
	});

	const currentTab = useMemo(() => {
		return tabs.find((tab) => tab.id === currentTabId)!;
	}, [currentTabId, tabs]);

	useEffect(() => setMounted(true), []);

	useEffect(() => {
		const dashUrl = getSettingsUrl(scopeData, currentTabId);
		window.history.replaceState({}, '', dashUrl);
	}, [scopeData, currentTabId]);

	useUpdateEffect(() => {
		window.scrollTo({ top: 0 });
	}, [currentTabId]);

	useSticky({
		target: stickyControlsRef.current!,
		offset: breadcrumbsOffset,
		isActive: mounted && !isMobile,
	});

	const persist = useCallback(async () => {
		setIsPersisting(true);
		try {
			await Promise.all([
				hasFacetsChanges && persistFacets(),
				hasNonFacetsChanges && persistNonFacets(),
			]);
		} catch (_) {
			// do nothing
		} finally {
			setIsPersisting(false);
		}
	}, [hasFacetsChanges, persistFacets, hasNonFacetsChanges, persistNonFacets]);

	useBeforeUnload(
		hasChanges,
		'You have unsaved changes. Are you sure you want to navigate away?',
	);

	const renderControls = () => {
		const { hideSaveButton } = currentTab;
		if (hideSaveButton) {
			const isSaving = pendingCount > 0;
			return <AutosaveIndicator isSaving={isSaving} />;
		}
		return (
			<Button
				intent="primary"
				disabled={!hasChanges}
				onClick={persist}
				loading={isPersisting}
				icon="tick"
			>
				Save changes
			</Button>
		);
	};

	const renderTab = (tab: Subtab, tabsAreMobile: boolean) => {
		const { id: tabId, title, ...iconProps } = tab;
		return (
			<Tab
				id={tabId}
				key={title}
				className="dashboard-settings-frame-tab"
				panelClassName="dashboard-settings-frame-tab-panel"
				title={
					<>
						<div className="icon-container">
							<div className="background-circle" />
							<Icon iconSize={tabsAreMobile ? 12 : 16} {...iconProps} />
						</div>
						<div className="title">{title}</div>
					</>
				}
			/>
		);
	};

	const renderTabs = (isMobileClassName: string, tabsAreMobile: boolean) => {
		return (
			<Tabs
				id={id}
				vertical={!!tabsAreMobile}
				large={!tabsAreMobile}
				selectedTabId={currentTabId}
				className={classNames('dashboard-settings-frame-tabs', isMobileClassName)}
				onChange={(nextId: string) => setCurrentTabId(nextId)}
			>
				{tabs.map((tab) => renderTab(tab, tabsAreMobile))}
			</Tabs>
		);
	};

	return (
		<DashboardFrame
			title="Settings"
			className={classNames('dashboard-settings-frame-component', className)}
		>
			<div className="dashboard-settings-frame-sticky-controls" ref={stickyControlsRef}>
				<MobileAware
					desktop={(p) => renderTabs(p.className, false)}
					mobile={(p) => renderTabs(p.className, true)}
				/>
				<div className="save-container">{renderControls()}</div>
			</div>
			<div className="dashboard-settings-frame-tab-panel">
				{currentTab.sections.map((section) => {
					const element = typeof section === 'function' ? section() : section;
					return element;
				})}
			</div>
		</DashboardFrame>
	);
};

const WithPendingChanges = (props: Props) => {
	return (
		<PendingChangesProvider>
			<DashboardSettingsFrame {...props} />
		</PendingChangesProvider>
	);
};

export default WithPendingChanges;
