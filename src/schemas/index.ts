import * as z from 'zod'
import * as Enums from '../enums/enums.js'
import * as LA2xi from './la2xi.js'
import * as LA4 from './la4.js'
import * as LA4x from './la4x.js'
import * as LA8 from './la8.js'
import * as LA116i from './la116i.js'
import * as LA12x from './la12x.js'
import * as LA716 from './la716.js'
import * as LA716i from './la716i.js'
import * as LC16D from './lc16d.js'
import * as LS10 from './ls10.js'
import * as P1 from './p1.js'

/* export const DeviceSchema = z.discriminatedUnion('info.name', [
	LA2xi.DeviceSchema,
	LA4.DeviceSchema,
	LA4x.DeviceSchema,
	LA8.DeviceSchema,
	LA116i.DeviceSchema,
	LA12x.DeviceSchema,
	LA716.DeviceSchema,
	LA716i.DeviceSchema,
	LC16D.DeviceSchema,
	LS10.DeviceSchema,
	P1.DeviceSchema,
]) */

export const DeviceSchemasByName = {
	'LA1.16i': LA116i.DeviceSchema,
	LA12X: LA12x.DeviceSchema,
	LA2Xi: LA2xi.DeviceSchema,
	LA4: LA4.DeviceSchema,
	LA4X: LA4x.DeviceSchema,
	'LA7.16': LA716.DeviceSchema,
	'LA7.16i': LA716i.DeviceSchema,
	LA8: LA8.DeviceSchema,
	LC16D: LC16D.DeviceSchema,
	LS10: LS10.DeviceSchema,
	P1: P1.DeviceSchema,
} as const

export const deviceSchemaList = [
	LA116i.DeviceSchema,
	LA12x.DeviceSchema,
	LA2xi.DeviceSchema,
	LA4.DeviceSchema,
	LA4x.DeviceSchema,
	LA716.DeviceSchema,
	LA716i.DeviceSchema,
	LA8.DeviceSchema,
	LC16D.DeviceSchema,
	LS10.DeviceSchema,
	P1.DeviceSchema,
] as const

export type DeviceSchema = z.infer<typeof DeviceSchema>
export type DeviceSchemasByName = {
	[K in Enums.InfoNameEnum]: z.infer<(typeof DeviceSchemasByName)[K]>
}
export type InfoNameEnum = keyof typeof DeviceSchemasByName

export const DeviceSchema = z.union(deviceSchemaList)

type TupleNames = z.infer<(typeof deviceSchemaList)[number]>['info']['name']

type MapNames = keyof typeof DeviceSchemasByName

export type _AssertSameNames = TupleNames extends MapNames ? (MapNames extends TupleNames ? true : never) : never

/* type DiscriminatedSchema<Name extends string = string> = z.ZodObject<{
	info: z.ZodObject<{
		name: z.ZodLiteral<Name>
	}>
}>

type DefineDeviceSchemasResult<T extends readonly [DiscriminatedSchema, ...DiscriminatedSchema[]]> = {
	schemas: T
	byName: { [K in T[number]['shape']['info']['shape']['name']['value']]: T[number] }
	union: z.ZodDiscriminatedUnion<'info.name', T>
}

export function defineDeviceSchemas<const T extends readonly [DiscriminatedSchema, ...DiscriminatedSchema[]]>(
	schemas: T,
): DefineDeviceSchemasResult<T> {
	const byName = Object.fromEntries(
		schemas.map((schema) => {
			const name = schema.shape.info.shape.name.value
			return [name, schema]
		}),
	)

	const union = z.discriminatedUnion('info.name', schemas)

	return {
		schemas,
		byName,
		union,
	}
}

export const deviceSchemaList = [
	LA116i.DeviceSchema,
	LA12x.DeviceSchema,
	LA2xi.DeviceSchema,
	LA4.DeviceSchema,
	LA4x.DeviceSchema,
	LA716.DeviceSchema,
	LA716i.DeviceSchema,
	LA8.DeviceSchema,
	LC16D.DeviceSchema,
	LS10.DeviceSchema,
	P1.DeviceSchema,
] as const
 */
