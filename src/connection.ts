import { io, Socket } from 'socket.io-client'
import { EventEmitter } from 'events'

export class SnapshotConnection extends EventEmitter {
	public io: Socket | undefined

	constructor(ip: string, port: number) {
		super()
		this.io = io(`http://${ip}:${port}`, {
			transports: ['websocket'],
			reconnection: true,
			timeout: 2000,
			reconnectionDelay: 1000,
			forceNew: true,
		})
		this.io.on('connect', () => {
			console.log('connect')
		})
	}

	destroy(): void {
		console.log('connection got destroy')
		if (this.io) {
			this.io.close()
			delete this.io
		}
	}
}
