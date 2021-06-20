import { io, Socket } from 'socket.io-client'
import { EventEmitter } from 'events'
import { Md5 } from 'md5-typescript'

export interface SnapshotState {
	error: null | string
	connected: boolean
	snapshots: { id: string; label: string; atem: string }[]
	rundowns: { id: string; label: string }[]
	atems: { id: string; label: string }[]
	users: { id: string; label: string }[]
	cues: { id: string; label: string; rundown: string }[]
}

export const EmptySnapshotState: SnapshotState = {
	error: null,
	connected: false,
	snapshots: [],
	rundowns: [],
	atems: [],
	users: [],
	cues: [],
}

export class SnapshotConnection extends EventEmitter {
	public socket: Socket | undefined
	public state: SnapshotState = EmptySnapshotState

	constructor(ip: string, port: number, secret: string, newState: (newState: SnapshotState) => void) {
		super()

		const socket = io(`http://${ip}:${port}`, {
			transports: ['websocket'],
			forceNew: true,
		})

		this.socket = socket

		socket.on('connect', () => {
			newState({ ...EmptySnapshotState, error: 'Authenticating' })
		})

		socket.on('disconnect', () => {
			newState({ ...EmptySnapshotState, error: 'Lost connection' })
		})

		// handle the event sent with socket.send()
		socket.on('api/salt', (salt: string, server: any) => {
			socket.emit('api/auth', Md5.init(salt + secret))
			console.log('connecting to server version:', server)
		})

		socket.on('api/auth/ok', () => {
			console.log('API AUTH OK')
			newState({ ...EmptySnapshotState, error: 'Connected, waiting for first sync' })
		})

		socket.on('api/state', (state: SnapshotState) => {
			console.log('newState')
			this.state = { ...state, connected: true, error: null }
			newState(this.state)
			//socket.emit('api/selectCueNext', '6f0b7df4-deeb-433d-bdff-3a743bb22926')
		})

		socket.on('api/state/partial', (_key: any, state: any) => {
			console.log('newState/partial')
			this.state = {
				...this.state,
				[_key]: state,
				connected: true,
				error: null,
			}
			newState(this.state)
		})
	}

	public selectCue(user: string, rundown: string): void {
		this.socket?.emit('api/selectCue', user, rundown)
	}

	public selectCueNext(user: string): void {
		this.socket?.emit('api/selectCueNext', user)
	}

	public selectCuePrevious(user: string): void {
		this.socket?.emit('api/selectCuePrevious', user)
	}

	public selectRundown(user: string, rundown: string): void {
		this.socket?.emit('api/selectRundown', user, rundown)
	}

	public selectRundownNext(user: string): void {
		this.socket?.emit('api/selectRundownNext', user)
	}

	public selectRundownPrevious(user: string): void {
		this.socket?.emit('api/selectRundownPrevious', user)
	}

	public runIsolatedCue(cue: string): void {
		this.socket?.emit('api/runIsolatedCue', cue)
	}

	public go(user: string): void {
		this.socket?.emit('api/go', user)
	}

	public panic(user: string): void {
		this.socket?.emit('api/panic', user)
	}

	public destroy(): void {
		if (this.socket !== undefined) {
			this.socket.close()
			delete this.socket
		}
	}
}
