import {
	FacetProp,
	CascadedTypeOfFacetProp,
	TypeOfFacetProp,
	NullableTypeOfFacetProp,
} from './prop';
import { FacetPropType, TypeOfPropType } from './propType';
import { FacetDefinition, FacetInstanceType } from './facet';
import { FacetCascadeNotImplError } from './errors';
import { mapFacet } from './map';

export type FacetSourceScope =
	| { kind: 'community' | 'collection' | 'pub'; id: string }
	| { kind: 'root'; id?: null };

export type WithScope<T> = {
	scope: FacetSourceScope;
	value: T;
};

export type AvailableCascadeStrategyForPropType<PropType extends FacetPropType> =
	// Any prop type can use the `overwrite` strategy
	| 'overwrite'
	// Only props that are objects can object-merge during cascade" {...a, ...b}
	| (TypeOfPropType<PropType> extends Record<string, any> ? 'merge' : never)
	// Only props that are arrays can array-merge during cascasde: [...a, ...b]
	| (TypeOfPropType<PropType> extends any[] ? 'extend' : never);

type PropCascadeContribution<Prop extends FacetProp> = {
	overwrite: NullableTypeOfFacetProp<Prop>;
	extend: TypeOfFacetProp<Prop> & any[];
	merge: Partial<TypeOfFacetProp<Prop>>;
}[Prop['cascade']];

type PropCascadeResult<Prop extends FacetProp> = {
	overwrite: CascadedTypeOfFacetProp<Prop>;
	extend: TypeOfFacetProp<Prop> & any[];
	merge: Partial<TypeOfFacetProp<Prop>>;
}[Prop['cascade']];

export type FacetPropCascadeResult<Prop extends FacetProp> = {
	value: PropCascadeResult<Prop>;
	contributions: WithScope<PropCascadeContribution<Prop>>[];
};

export type FacetCascadedType<Def extends FacetDefinition> = {
	[K in keyof Def['props']]: PropCascadeResult<Def['props'][K]>;
};

export type FacetCascadeResult<Def extends FacetDefinition> = {
	value: FacetCascadedType<Def>;
	props: { [K in keyof Def['props']]: FacetPropCascadeResult<Def['props'][K]> };
};

function cascadeProp<Prop extends FacetProp>(
	prop: Prop,
	sources: WithScope<NullableTypeOfFacetProp<Prop>>[],
): FacetPropCascadeResult<Prop> {
	const { cascade: cascadeStrategy } = prop;
	if (cascadeStrategy === 'overwrite') {
		type PropWithCascade = Prop & { cascade: 'overwrite' };
		const contributions: WithScope<PropCascadeContribution<PropWithCascade>>[] = sources.filter(
			(s) => s.value !== null,
		);
		const value: PropCascadeResult<PropWithCascade> = sources
			.map((s) => s.value)
			.reduce((a, b) => b ?? a, null);
		return { contributions, value };
	}
	if (cascadeStrategy === 'extend') {
		type PropWithCascade = Prop & { cascade: 'extend' };
		const contributions: WithScope<PropCascadeContribution<PropWithCascade>>[] = sources.filter(
			(scope): scope is WithScope<TypeOfFacetProp<Prop>> => scope.value !== null,
		);
		const value: PropCascadeResult<PropWithCascade> = sources
			.map((s) => (s.value || []) as any[])
			.reduce((a, b) => [...a, ...b], []);
		return { contributions, value };
	}
	throw new FacetCascadeNotImplError(cascadeStrategy);
}

export function cascade<Def extends FacetDefinition>(
	def: Def,
	instances: WithScope<FacetInstanceType<Def>>[],
): FacetCascadeResult<Def> {
	const props = mapFacet(def, (key, prop) => {
		const propInstances = instances.map((instance) => {
			const { scope, value } = instance;
			return { scope, value: value[key] };
		});
		return cascadeProp(prop, [
			{ scope: { kind: 'root' }, value: prop.rootValue },
			...propInstances,
		]);
	}) as FacetCascadeResult<Def>['props'];
	const value = mapFacet(def, (key) => {
		return props[key].value;
	}) as FacetCascadedType<Def>;
	return { props, value };
}
