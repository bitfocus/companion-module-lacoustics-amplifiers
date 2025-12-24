import { DeviceStatusSchema, type ControlDspOutputSchema } from './schemas.js'

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
}
