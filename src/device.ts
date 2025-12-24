import { DeviceStatusSchema } from './schemas.js'

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
}
