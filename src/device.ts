import { DeviceStatusSchema, type ControlDspOutputSchema, type LevelPeakSchema } from './schemas.js'

export class LacousticDevice {
	#device!: DeviceStatusSchema

	constructor(device: unknown) {
		const newDevice = DeviceStatusSchema.parse(device)
		this.#device = newDevice
	}

	set device(device: unknown) {
		const newDevice = DeviceStatusSchema.parse(device)
		this.#device = newDevice
	}

	get power(): boolean {
		return this.#device.power.standby ?? false
	}

	get outputChannelCount(): number {
		return this.#device.control.dsp.output.length
	}

	get outputChannels(): ControlDspOutputSchema[] {
		return this.#device.control.dsp.output
	}

	get outputLevelsCount(): number {
		return this.#device.level.dsp.output.length
	}

	get inputLevelsCount(): number {
		return this.#device.level.dsp.input.length
	}

	get outputLevels(): LevelPeakSchema[] {
		return this.#device.level.dsp.output
	}

	get inputLevels(): LevelPeakSchema[] {
		return this.#device.level.dsp.input
	}
}
