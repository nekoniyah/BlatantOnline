class Controller extends EventTarget {
	constructor() {
		super();
	}

	public on(event: string, callback: (...args: any[]) => void) {
		this.addEventListener(event, callback);
	}

	public emit(event: string, ...args: any[]) {
		this.dispatchEvent(new CustomEvent(event, { detail: args }));
	}
}

const controller = new Controller();

export default controller;
