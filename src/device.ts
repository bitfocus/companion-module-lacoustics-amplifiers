import { type ControlDspOutputSchema, type LevelPeakSchema } from './schemas/base.js'
import { DeviceSchema, DeviceSchemasByName } from './schemas/index.js'
import * as Enums from './enums/enums.js'
/* import * as LA116i from './schemas/la116i.js'
import * as LA12x from './schemas/la12x.js'
import * as LA2xi from './schemas/la2xi.js'
import * as LA4 from './schemas/la4.js'
import * as LA4x from './schemas/la4x.js'
import * as LA716 from './schemas/la716.js'
import * as LA716i from './schemas/la716i.js'
import * as LA8 from './schemas/la8.js'
import * as LC16D from './schemas/lc16d.js'
import * as LS10 from './schemas/ls10.js'
import * as P1 from './schemas/p1.js' */

export class LacousticDevice<N extends Enums.InfoNameEnum> {
	#device!: DeviceSchemasByName[N]

	private constructor(device: DeviceSchemasByName[N]) {
		this.#device = device
	}

	static fromUnknown(device: unknown): LacousticDevice<Enums.InfoNameEnum> {
		const parsed = DeviceSchema.parse(device)
		return new LacousticDevice(parsed)
	}

	set device(device: unknown) {
		const newDevice = DeviceSchemasByName[this.#device.info.name].parse(device)
		if (newDevice.info.name !== this.#device.info.name)
			throw new Error(`Device name mismatch: expected ${this.#device.info.name}, got ${newDevice.info.name}`)
		this.#device = newDevice as DeviceSchemasByName[N]
	}

	set devicePartial(device: unknown) {
		const newDevice = DeviceSchemasByName[this.#device.info.name].partial().parse(device)
		this.#device = { ...this.#device, ...newDevice }
	}

	get name(): string {
		return this.#device.info.name
	}

	get power(): boolean {
		return this.#device.power.standby ?? false
	}

	get outputChannelCount(): number {
		if ('control' in this.#device && 'dsp' in this.#device.control) {
			return this.#device.control.dsp.output.length
		}
		return 0
	}

	get outputChannels(): ControlDspOutputSchema[] {
		if ('control' in this.#device && 'dsp' in this.#device.control) {
			return this.#device.control.dsp.output
		}
		return []
	}

	get outputLevelsCount(): number {
		if ('level' in this.#device && 'output' in this.#device.level) {
			return this.#device.level.dsp.output.length
		}
		return 0
	}

	get inputLevelsCount(): number {
		if ('level' in this.#device && 'input' in this.#device.level) {
			return this.#device.level.dsp.input.length
		}
		return 0
	}

	get outputLevels(): LevelPeakSchema[] {
		if ('level' in this.#device && 'output' in this.#device.level) {
			return this.#device.level.dsp.output
		}
		return []
	}

	get inputLevels(): LevelPeakSchema[] {
		if ('level' in this.#device && 'input' in this.#device.level) {
			return this.#device.level.dsp.input
		}
		return []
	}
}
