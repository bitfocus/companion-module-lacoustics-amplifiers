import * as z from 'zod'
import * as Schemas from './base.js'

export const DeviceSchema = z.object({
	info: Schemas.InfoSchema.extend({
		name: z.literal('P1'),
	}),
	/* 	network: Schemas.NetworkSchema,
    avdecc: Schemas.AvdeccSchema,
    hmi: Schemas.HmiSchema.omit({ lock: true, unit: true, option: true }),
    ptp: Schemas.PtpSchema,
    bridge: Schemas.BridgeSchema,
    lldp: Schemas.LldpSchema,
    input: Schemas.InputSchema,
    routing: Schemas.RoutingSchema,
    power: Schemas.PowerSchema,
    gpio: Schemas.GpioSchema,
    control: Schemas.ControlSchema,
    clock: Schemas.ClockSchema,
    monitor: Schemas.MonitorSchema,
    en54: Schemas.En54Schema,
    level: Schemas.LevelSchema,
    layout: Schemas.LayoutSchema,
    avb: Schemas.AvbSchema,
    aes67: Schemas.Aes67Schema, */
})

export type DeviceSchema = z.infer<typeof DeviceSchema>
