import { FacetDefinition, FacetInstanceType } from './facet';
import { FacetParseError } from './errors';

function parsePartialOrEntireFacetInstance<
	Def extends FacetDefinition,
	InstanceKey extends keyof Def['props'],
	AllowPartialInstance extends boolean,
	ReturnType = Pick<FacetInstanceType<Def>, InstanceKey>,
>(
	definition: Def,
	instance: Record<InstanceKey, any>,
	allowPartialInstance: AllowPartialInstance,
): ReturnType {
	const { props } = definition;
	const parsedInstance: Partial<ReturnType> = {};
	const instanceKeys = Object.keys(instance);
	Object.entries(props).forEach(([propName, prop]) => {
		const instanceHasKey = instanceKeys.includes(propName);
		if (instanceHasKey) {
			const propSchema = prop.propType.schema;
			const instanceValue = instance[propName];
			if (instanceValue === null) {
				parsedInstance[propName as any] = null;
			} else {
				const parsedValue = propSchema.safeParse(instanceValue);
				if (parsedValue.success) {
					parsedInstance[propName as any] = parsedValue.data;
				} else {
					throw new FacetParseError(definition, propName, instanceValue);
				}
			}
		} else if (!allowPartialInstance) {
			throw new FacetParseError(definition, propName, undefined);
		}
	});
	return parsedInstance as ReturnType;
}

export function parsePartialFacetInstance<
	Def extends FacetDefinition,
	InstanceKey extends keyof Def['props'],
>(definition: Def, instance: Record<InstanceKey, any>) {
	return parsePartialOrEntireFacetInstance(definition, instance, true);
}

export function parseFacetInstance<Def extends FacetDefinition>(
	definition: Def,
	instance: Record<keyof Def['props'], any>,
) {
	return parsePartialOrEntireFacetInstance(definition, instance, false);
}
