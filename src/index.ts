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
import { SnapshotConnection, SnapshotState, EmptySnapshotState } from './connection'

class SnapshotInstance extends InstanceSkel<DeviceConfig> {
	connection: SnapshotConnection | undefined
	connectionState: SnapshotState = EmptySnapshotState

	constructor(system: CompanionSystem, id: string, config: DeviceConfig) {
		super(system, id, config)
	}

	public init(): void {
		if (this.config.host && this.config.port && this.config.secret) {
			this.connection = new SnapshotConnection(
				this.config.host,
				parseInt(this.config.port),
				this.config.secret,
				(newState) => {
					if (newState.connected) this.status(this.STATUS_OK)
					else if (!newState.connected) this.status(this.STATUS_ERROR)

					this.connectionState = newState
					this.updateActions()
				}
			)
			this.status(this.STATUS_WARNING, 'Initializing')
		}

		this.updateConfig(this.config)
		this.updateActions()
	}

	private updateActions() {
		this.setActions(GetActionsList(this.connectionState))
	}

	public updateConfig(config: DeviceConfig): void {
		if (JSON.stringify(config) !== JSON.stringify(this.config)) {
			this.config = config
			this.status(this.STATUS_ERROR, `Load manager failed`)
			console.log('init from updateConfig')
			if (this.connection) this.connection.destroy()
			this.init()
		}
	}

	public action(action: CompanionActionEvent): void {
		if (this.connection) HandleAction(this.connection, action)
		else {
			this.debug('no connection to handle action', action)
		}
	}

	public config_fields(): CompanionConfigField[] {
		console.log('config_fields()')
		return GetConfigFields(this)
	}

	public destroy(): void {
		this.connection?.destroy()
		delete this.connection
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
