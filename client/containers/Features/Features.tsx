import React from 'react';
import { Icon } from 'components';

require('./features.scss');

const features = [
	{
		icon: 'at',
		title: 'Item Labels & Referencing',
		desc: 'Automatically (or custom) label images, videos, and equations.',
	},
	{
		icon: 'badge',
		title: 'DOI Support',
		desc: 'Generate CrossRef DOIs for your documents in one click.',
	},
	{
		icon: 'comment',
		title: 'Discussions & Annotations',
		desc: 'Host public and private discussions with your readers and community, whether in your classroom or across the world.',
	},
	{
		icon: 'page-layout',
		title: 'Easily Customizable Layouts',
		desc: 'Create your custom site without writing a line of code.',
	},
	{
		icon: 'book',
		title: 'Collection Metadata',
		desc: 'Include article & collection-level metadata for easier organization of content and improved discovery.',
	},
	{
		icon: 'people',
		title: 'Access Control',
		desc: 'Allow anyone to access your content, or just the people you choose.',
	},
	{
		icon: 'grouped-bar-chart',
		title: 'Impact Measurement',
		desc: 'Learn about the people visiting your community with a full suite of privacy-respecting analytics.',
	},
	{
		icon: 'export',
		title: 'Document Export',
		desc: 'Export your work to PDF, Word, Markdown, LaTeX, JATS XML, and more.',
	},
] as const;

const Features = function () {
	const featureGrid = features.map((feature) => {
		return (
			<div className="feature" key={feature.icon}>
				<Icon icon={feature.icon} className="icon" />
				<div className="description">
					<h4>{feature.title}</h4>
					<p>{feature.desc}</p>
				</div>
			</div>
		);
	});

	return (
		<div id="features-box">
			<div className="container">
				<div className="subtitle-1">
					a feature rich platform <span className="smaller">for</span>
				</div>
				<div className="subtitle-1">authoring & publishing</div>
			</div>
			<div className="features-list">
				<div className="feature">
					<div className="container">
						<p className="title">Dashboard to control settings & processes</p>
						<div className="content">
							<div className="bullets">
								<ul>
									<li>Control settings at any scope level.</li>
									<li>Explore & access to all your content in one place.</li>
									<li>Designed to make administrative tasks much simpler.</li>
								</ul>
							</div>
							<img
								className="graphic"
								src="/static/landing/features/dashboard.png"
								alt="alt"
							/>
						</div>
					</div>
				</div>
				<div className="feature alt-row">
					<div className="container">
						<p className="title">Create Workflows for Submissions & Reviews</p>
						<div className="content">
							<div className="bullets">
								<ul>
									<li>
										Enable authors to submit pubs as part of editorial process.
									</li>
									<li>Flexible submission flows to suit your needs.</li>
									<li>Tight integration with email correspondence.</li>
								</ul>
							</div>
							<img
								className="graphic"
								src="/static/landing/features/submissions.png"
								alt="alt"
							/>
						</div>
					</div>
				</div>
				<div className="feature">
					<div className="container">
						<p className="title">Cascading Settings</p>
						<div className="content">
							<div className="bullets">
								<ul>
									<li>Set default pub-settings at higher scope levels.</li>
									<li>Expedite & standardize your workflows.</li>
									<li>Implement consistent styling across content.</li>
								</ul>
							</div>
							<img
								className="graphic"
								src="/static/landing/features/cascading.png"
								alt="alt"
							/>
						</div>
					</div>
				</div>
				<div className="feature alt-row">
					<div className="container">
						<p className="title">Pub Connections</p>
						<div className="content">
							<div className="bullets">
								<ul>
									<li>
										Add indicators that one pub is related to another pub, or
										any other content on the internet.
									</li>
									<li>Deposit pubs to Crossref with typed relationships.</li>
									<li>Specify directionality & nature of connections.</li>
								</ul>
							</div>
							<img
								className="graphic"
								src="/static/landing/features/connections.png"
								alt="alt"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="otherfeatures-box">
				<div className="container">
					<div className="title">other features of pubpub</div>
					<div className="feature-grid">{featureGrid}</div>
					<div className="subtext1">
						Visit our{' '}
						<a href="https://github.com/orgs/pubpub/projects/9" target="_blank">
							Product Roadmap
						</a>
						&nbsp;to see other new features we have in the pipeline!
					</div>
				</div>
			</div>
		</div>
	);
};

export default Features;
