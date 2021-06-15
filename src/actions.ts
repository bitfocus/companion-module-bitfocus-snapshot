import InstanceSkel = require('../../../instance_skel')
import { CompanionActionEvent, CompanionActions } from '../../../instance_skel_types'
import { DeviceConfig } from './config'

export enum PlayPauseToggle {
	Play = 'play',
	Pause = 'pause',
	Toggle = 'toggle',
}

export enum ActionId {
	CueSelectDown = 'cue_select_down',
}

export function GetActionsList(_instance: InstanceSkel<DeviceConfig>): CompanionActions {
	const actions: CompanionActions = {}

	actions[ActionId.CueSelectDown] = {
		label: 'Cue Select Down',
		options: [
			{
				id: 'cue',
				type: 'dropdown',
				label: 'Cue',
				default: 'test',
				choices: [{ id: 'test', label: 'Test' }],
			},
		],
	}

	return actions
}

export function HandleAction(_instance: InstanceSkel<DeviceConfig>, action: CompanionActionEvent): void {
	const opt = action.options
	console.log('opt', opt)
}
