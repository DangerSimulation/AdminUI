export interface WebSocketMessage<T> {
	messageType: string,
	data: T
}

