import * as z from 'zod'
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

export const DeviceSchema = z.discriminatedUnion('info.name', [
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
])
