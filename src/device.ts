import type { ControlDspOutputSchema, InfoSchema, LevelPeakSchema } from './schemas/base.js'
import { DeviceSchemasByName } from './schemas/index.js'
//import * as Schemas from './schemas/base.js'
import * as Enums from './enums/enums.js'
import { feedbackSubscriptions } from './types.js'

function isValidInfoName(name: unknown): name is Enums.InfoNameEnum {
	return typeof name === 'string' && name in DeviceSchemasByName
}

export class LacousticDevice<N extends Enums.InfoNameEnum> {
	#device!: DeviceSchemasByName[N]

	private constructor(device: DeviceSchemasByName[N]) {
		this.#device = device
	}

	static fromUnknown(data: unknown): LacousticDevice<Enums.InfoNameEnum> {
		if (typeof data == 'string') data = JSON.parse(data)
		if (typeof data !== 'object') throw new Error('Can not initialize device, unknown data type')
		const name = (data as any)?.info?.name
		if (isValidInfoName(name)) {
			const device = DeviceSchemasByName[name].parse(data)
			//const parsed = DeviceSchema.parse(data)
			return new LacousticDevice(device)
		}
		throw new Error(`Unsupported device type: ${name}`)
	}

	static initFeedbackSubscriptionTracker(): feedbackSubscriptions {
		return {
			aes: new Set<string>(),
			aes67: new Set<string>(),
			avb: new Set<string>(),
			avdecc: new Set<string>(),
			bridge: new Set<string>(),
			clock: new Set<string>(),
			configuration: new Set<string>(),
			control: new Set<string>(),
			en54: new Set<string>(),
			fan: new Set<string>(),
			gpio: new Set<string>(),
			hmi: new Set<string>(),
			info: new Set<string>(),
			input: new Set<string>(),
			layout: new Set<string>(),
			level: new Set<string>(),
			lldp: new Set<string>(),
			madi: new Set<string>(),
			monitor: new Set<string>(),
			mpl: new Set<string>(),
			network: new Set<string>(),
			output: new Set<string>(),
			power: new Set<string>(),
			ptp: new Set<string>(),
			routing: new Set<string>(),
			siggen: new Set<string>(),
		}
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

	get powerSmpsStatus(): Record<number, boolean> {
		const SmpsStatus: Record<number, boolean> = {}
		if ('status' in this.#device.power && 'smps' in this.#device.power.status) {
			if (typeof this.#device.power.status.smps == 'boolean') SmpsStatus[1] = this.#device.power.status.smps
			else if (Array.isArray(this.#device.power.status.smps)) {
				this.#device.power.status.smps.forEach((psu) => {
					SmpsStatus[psu.index] = psu.state
				})
			}
		}
		return SmpsStatus
	}

	get powerSmpsCount(): number {
		let PsuCount = 0
		if ('status' in this.#device.power && 'smps' in this.#device.power.status) {
			if (typeof this.#device.power.status.smps == 'boolean') PsuCount = 1
			if (Array.isArray(this.#device.power.status.smps)) {
				PsuCount = this.#device.power.status.smps.length
			}
		}
		return PsuCount
	}

	get powerHas24vIn(): boolean {
		return 'status' in this.#device.power && 'inp24v' in this.#device.power.status
	}

	get power24vIn(): boolean {
		if ('status' in this.#device.power && 'inp24v' in this.#device.power.status) {
			return this.#device.power.status.inp24v
		}
		return false
	}

	get powerHas24vOut(): boolean {
		return 'status' in this.#device.power && 'out24v' in this.#device.power.status
	}

	get power24vOut(): boolean {
		if ('status' in this.#device.power && 'out24v' in this.#device.power.status) {
			return this.#device.power.status.out24v
		}
		return false
	}

	get powerHasMains(): boolean {
		return 'status' in this.#device.power && 'mains' in this.#device.power.status
	}

	get powerMains(): boolean {
		if ('status' in this.#device.power && 'mains' in this.#device.power.status) {
			return this.#device.power.status.mains
		}
		return false
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

	get avdeccSupported(): boolean {
		return 'avdecc' in this.#device
	}

	get avdeccLock(): boolean {
		return 'avdecc' in this.#device ? this.#device.avdecc.lock : false
	}

	get avdeccEntityId(): string {
		return 'avdecc' in this.#device ? this.#device.avdecc.entity_id : ''
	}

	get clockSupported(): boolean {
		return 'clock' in this.#device
	}

	get clockLocked(): boolean {
		return 'clock' in this.#device ? this.#device.clock.source.locked : false
	}

	get clockStatus(): string {
		return 'clock' in this.#device ? this.#device.clock.source.status : ''
	}

	get clockType(): string {
		return 'clock' in this.#device ? this.#device.clock.source.type : ''
	}

	get ptpSupported(): boolean {
		return 'ptp' in this.#device
	}

	get ptpSecondarySupported(): boolean {
		return 'ptp' in this.#device && 'secondary' in this.#device.ptp
	}

	get ptpV2Domain(): number {
		return 'ptp' in this.#device ? this.#device.ptp.ptpv2_domain : 0
	}
}
