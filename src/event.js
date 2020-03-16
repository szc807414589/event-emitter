import { JOIN_STRING } from './constant';

class _CreateEvent {
	constructor(event, wait = 1) {
		// this.eventArr = [].concat(event);
		const arr = event.split(JOIN_STRING);
		const temp = {};
		arr.forEach(v => {
			temp[v] = [];
		});
		this.eventKeyArr = arr;
		this.events = [];
		this.emitted = [];
		this.payload = temp;
		this.wait = wait;
		this.emittedTime = 0;
	}
}

const createEvent = (event, wait) => new _CreateEvent(event, wait);

export default createEvent;
