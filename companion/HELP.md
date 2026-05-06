## L'Acoustics Amplifiers

HTTP Rest API

### Supported Devices

The module should work with all contemporary L'Acoustics amplifiers, with a minimum firmware of 2.16.
To date the following devices have been tested and confirmed working:

- LA1.16i
- LA2Xi

Please confirm functionality or report issues with other devices on the [git repo](https://github.com/bitfocus/companion-module-lacoustics-amplifiers/issues). Non amplifier electronics, LC16D, LS10, P1 are nominally supported by the API but may have few if any supported actions and feedbacks at this stage.

Available actions and feedbacks depend on the specific model being controlled

### Actions

- Output - Delay
- Output - Gain
- Output - Mute
- Output - Polarity
- Power
- Reboot

### Feedbacks

- Avdecc - Lock _Boolean_
- Avdecc - Entity Id _Value_
- Clock - Locked _Boolean_
- Clock - Status _Value_
- Clock - Type _Value_
- DSP Output - Mute _Boolean_
- DSP Output - Polarity _Boolean_
- DSP Output - Delay _Value_
- DSP Output - Gain _Value_
- DSP Output - Volume _Value_
- Level Meter - DSP Input _Advanced_
- Level Meter - DSP Output _Advanced_
- Levels - DSP Input _Value_
- Levels - DSP Output _Value_
- Power - Standby _Boolean_
- Power - SMPS Status _Boolean_
- Power - 24V In _Boolean_
- Power - 24V Out _Boolean_
- Power - Mains _Boolean_
- PTP - V2 Domain _Value_
- PTP - Primary _Value_
- PTP - Secondary _Value_

### Variables

- Device Info
