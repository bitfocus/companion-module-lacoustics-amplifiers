import type { ControlDspOutputSchema, InfoSchema, LevelPeakSchema } from './schemas/base.js'
import { DeviceSchema, DeviceSchemasByName } from './schemas/index.js'
import * as Enums from './enums/enums.js'

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

	get info(): InfoSchema {
		return this.#device.info
	}

	get powerStandby(): boolean {
		if ('standby' in this.#device.power) return this.#device.power.standby
		return false
	}

	get powerCanStandby(): boolean {
		return 'standby' in this.#device.power ? true : false
	}

	get powerRebootable(): boolean {
		return 'reboot' in this.#device.power ? true : false
	}

	get outputDspChannelCount(): number {
		if ('control' in this.#device && 'dsp' in this.#device.control) {
			return this.#device.control.dsp.output.length
		}
		return 0
	}

	get outputDspChannels(): ControlDspOutputSchema[] {
		if ('control' in this.#device && 'dsp' in this.#device.control) {
			return this.#device.control.dsp.output
		}
		return []
	}

	get outputDspLevelsCount(): number {
		if ('level' in this.#device && 'dsp' in this.#device.level) {
			return this.#device.level.dsp.output.length
		}
		return 0
	}

	get inputDspLevelsCount(): number {
		if ('level' in this.#device && 'dsp' in this.#device.level) {
			return this.#device.level.dsp.input.length
		}
		return 0
	}

	get outputDspLevels(): LevelPeakSchema[] {
		if ('level' in this.#device && 'dsp' in this.#device.level) {
			return this.#device.level.dsp.output
		}
		return []
	}

	get inputDspLevels(): LevelPeakSchema[] {
		if ('level' in this.#device && 'dsp' in this.#device.level) {
			return this.#device.level.dsp.input
		}
		return []
	}
}
