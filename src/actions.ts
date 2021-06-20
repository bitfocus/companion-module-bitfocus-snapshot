import {
	CompanionActionEvent,
	CompanionActions,
	CompanionInputFieldDropdown,
	DropdownChoice,
} from '../../../instance_skel_types'
import { SnapshotConnection, SnapshotState } from './connection'

export enum ActionId {
	SelectCue = 'selectCue',
	SelectCueNext = 'selectCueNext',
	SelectCuePrevious = 'selectCuePrevious',
	SelectRundown = 'selectRundown',
	SelectRundownNext = 'selectRundownNext',
	SelectRundownPrevious = 'selectRundownPrevious',
	RunIsolatedCue = 'runIsolatedCue',
	Go = 'go',
	Panic = 'panic',
}

export function GetActionsList(state: SnapshotState): CompanionActions {
	const actions: CompanionActions = {}
	const cueChoiceList: DropdownChoice[] = []
	const rundownChoiceList: DropdownChoice[] = []
	const userChoiceList: DropdownChoice[] = []

	state.rundowns.forEach((rundown) => {
		rundownChoiceList.push({
			id: rundown.id,
			label: rundown.label,
		})

		state.cues
			.filter((obj) => obj.rundown === rundown.id)
			.forEach((cue) => {
				cueChoiceList.push({
					id: cue.id,
					label: `${rundown.label} - ${cue.label}`,
				})
			})
	})

	state.users.forEach((user) => {
		userChoiceList.push({
			id: user.id,
			label: user.label,
		})
	})

	const userSelector: CompanionInputFieldDropdown = {
		id: 'user',
		type: 'dropdown',
		label: 'User',
		default: userChoiceList[0]?.id || '',
		choices: userChoiceList,
	}

	actions[ActionId.SelectCue] = {
		label: 'Cue: Select',
		options: [
			{
				id: 'cue',
				type: 'dropdown',
				label: 'Cue',
				default: cueChoiceList[0]?.id || '',
				choices: cueChoiceList,
			},
			userSelector,
		],
	}

	actions[ActionId.SelectCueNext] = {
		label: 'Cue: Select next',
		options: [userSelector],
	}

	actions[ActionId.SelectCuePrevious] = {
		label: 'Cue: Select previous',
		options: [userSelector],
	}

	actions[ActionId.SelectRundown] = {
		label: 'Cue list: Select',
		options: [
			{
				id: 'rundown',
				type: 'dropdown',
				label: 'Cue list',
				default: rundownChoiceList[0]?.id || '',
				choices: rundownChoiceList,
			},
			userSelector,
		],
	}

	actions[ActionId.SelectRundownNext] = {
		label: 'Cue list: Select next',
		options: [userSelector],
	}

	actions[ActionId.SelectRundownPrevious] = {
		label: 'Cue list: Select previous',
		options: [userSelector],
	}

	actions[ActionId.RunIsolatedCue] = {
		label: 'Cue: Run isolated',
		options: [
			{
				id: 'cue',
				type: 'dropdown',
				label: 'Cue',
				default: cueChoiceList[0]?.id || '',
				choices: cueChoiceList,
			},
		],
	}

	actions[ActionId.Go] = {
		label: 'Go',
		options: [userSelector],
	}

	actions[ActionId.Panic] = {
		label: 'Panic',
		options: [userSelector],
	}

	return actions
}

export function HandleAction(connection: SnapshotConnection, action: CompanionActionEvent): void {
	switch (action.action) {
		case ActionId.SelectCue:
			connection.selectCue(action.options.user as string, action.options.cue as string)
			break

		case ActionId.SelectCueNext:
			connection.selectCueNext(action.options.user as string)
			break

		case ActionId.SelectCuePrevious:
			connection.selectCuePrevious(action.options.user as string)
			break

		case ActionId.SelectRundown:
			connection.selectRundown(action.options.user as string, action.options.rundown as string)
			break

		case ActionId.SelectRundownNext:
			connection.selectRundownNext(action.options.user as string)
			break

		case ActionId.SelectRundownPrevious:
			connection.selectRundownPrevious(action.options.user as string)
			break

		case ActionId.RunIsolatedCue:
			connection.runIsolatedCue(action.options.cue as string)
			break

		case ActionId.Go:
			connection.go(action.options.user as string)
			break

		case ActionId.Panic:
			connection.panic(action.options.user as string)
			break
	}
}
