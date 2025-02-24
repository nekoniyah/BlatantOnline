export class Board {
	height: number;
	width: number;
	matrix: any[][] = [];

	constructor(height: number, width: number) {
		this.width = width;
		this.height = height;
	}

	init(selector: string) {
		let element = document.querySelector(selector)!;

		for (let y = 0; y < this.width; y++) {
			let row = document.createElement('div');
			row.classList.add('row', `row-${y}`);
			let yArr = [];

			for (let x = 0; x < this.height; x++) {
				let hex = document.createElement('div');
				hex.classList.add('hex', `hex-${x}`, 'red');

				row.appendChild(hex);
				yArr.push({
					hex
				});
			}

			this.matrix.push(yArr);
			element.appendChild(row);
		}
	}
}

export class Pawn {
	type: string;
	position: [number, number];

	constructor(type: string, position: [number, number]) {
		this.type = type;
		this.position = position;
	}
}

export class Card {
	id: string;
	name: string;
	cost: number;

	constructor(id: string, name: string, cost: number) {
		this.id = id;
		this.name = name;
		this.cost = cost;
	}

	effect(callback: () => void) {}
}

export class Player {
	name: string = '';
	energy: number = 4;
	cards: Card[] = []; //Card todo

	constructor(name: string) {
		this.name = name;
		this.draw(4);
	}

	draw(count: number) {}
}
