import InstanceSkel = require('../../../instance_skel')
import {
	CompanionActionEvent,
	CompanionConfigField,
	//CompanionFeedbackEvent,
	//CompanionFeedbackResult,
	CompanionSystem,
} from '../../../instance_skel_types'

import { GetActionsList, HandleAction } from './actions'
import { DeviceConfig, GetConfigFields } from './config'
import { SnapshotConnection } from './connection'

class SnapshotInstance extends InstanceSkel<DeviceConfig> {
	connection: SnapshotConnection | null = null

	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)
	}

	public init(): void {
		console.log('INIT')
		if (this.config.host && this.config.port) {
			console.log('STARTING SNAPSHOT CONNECTION')
			this.connection = new SnapshotConnection(this.config.host, parseInt(this.config.port))
		}

		this.status(this.STATUS_UNKNOWN)

		this.updateConfig(this.config)
		this.setActions(GetActionsList(this))
	}

	public updateConfig(config: DeviceConfig): void {
		if (JSON.stringify(config) !== JSON.stringify(this.config)) {
			this.config = config
			this.status(this.STATUS_ERROR, `Load manager failed`)
			console.log('init from updateConfig')
			if (this.connection !== null) this.connection.destroy()
			this.init()
		}
	}

	public action(action: CompanionActionEvent): void {
		console.log('action', action)
		HandleAction(this, action)
	}

	public config_fields(): CompanionConfigField[] {
		console.log('config_fields()')
		return GetConfigFields(this)
	}

	public destroy(): void {
		try {
			//
		} catch (e) {
			// Ignore
		}

		if (this.connection !== null) this.connection.destroy()

		this.debug('destroy', this.id)
	}

	/**
	 * Processes a feedback state.
	 */
	/*
	public feedback(feedback: CompanionFeedbackEvent): CompanionFeedbackResult {
		return ExecuteFeedback(this, this.manager, feedback)
	}
	*/
}

export = SnapshotInstance
