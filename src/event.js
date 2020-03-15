class _CreateEvent {
	constructor(event, fn, wait = 1) {
		this.eventArr = [].concat(event);
		this.callback = fn;
		this.wait = wait;
	}
}

const createEvent = (event, fn, wait = 1) => new _CreateEvent(event, fn, wait);

export default createEvent;
