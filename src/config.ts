import InstanceSkel = require('../../../instance_skel')
import { SomeCompanionConfigField } from '../../../instance_skel_types'

export interface DeviceConfig {
	host?: string
	port?: string
}

export function GetConfigFields(self: InstanceSkel<DeviceConfig>): SomeCompanionConfigField[] {
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'IP',
			width: 8,
			default: '127.0.0.1',
			regex: self.REGEX_IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Port',
			width: 4,
			default: '8050',
			regex: self.REGEX_PORT,
		},
	]
}
