import { boardData, Room } from '../classes/Game';

const hexSize = 30;
const hexWidth = Math.sqrt(3) * hexSize;
const hexHeight = 2 * hexSize * 0.75;

export function hexToPixel(q: number, r: number) {
	return {
		x: q * hexWidth + (r % 2 ? hexWidth / 2 : 0),
		y: r * hexHeight
	};
}

// Add these helper functions at the top of the script section
export function getNeighbors(q: number, r: number): [number, number][] {
	const evenRow = r % 2 === 0;

	// Proper axial offsets for staggered rows
	const directions = evenRow
		? [
				[1, 0],
				[0, -1],
				[-1, -1],
				[-1, 0],
				[-1, 1],
				[0, 1]
			] // Even rows shift left
		: [
				[1, 0],
				[1, -1],
				[0, -1],
				[-1, 0],
				[0, 1],
				[1, 1]
			]; // Odd rows shift right

	return directions.map(([dq, dr]) => [q + dq, r + dr]);
}

// Breadth-first search to find valid paths
export function findPath(
	start: [number, number],
	end: [number, number],
	maxSteps: number = 3
): boolean {
	const queue: Array<{ pos: [number, number]; steps: number }> = [{ pos: start, steps: 0 }];
	const visited = new Set<string>();

	while (queue.length > 0) {
		const current = queue.shift()!;
		const [currentQ, currentR] = current.pos;
		const key = `${currentQ},${currentR}`;

		if (visited.has(key)) continue;
		visited.add(key);

		// Found the target
		if (currentQ === end[0] && currentR === end[1]) {
			return true;
		}

		// Don't explore further if we've reached max steps
		if (current.steps >= maxSteps) continue;

		// Get all valid neighbors
		const neighbors = getNeighbors(currentQ, currentR);
		for (const neighbor of neighbors) {
			const [nq, nr] = neighbor;

			// Find the tile in boardData
			const neighborTile = boardData.find((t) => t.q === nq && t.r === nr);

			// Skip if the neighbor is a wall or doesn't exist
			if (!neighborTile || neighborTile.color === 'black') continue;

			queue.push({
				pos: [nq, nr],
				steps: current.steps + 1
			});
		}
	}

	return false;
}

// Update the isValidMove function
export function isValidMove(
	from: [number, number],
	to: [number, number],
	state: Room & { tile: any }
): boolean {
	// Check if the target tile is valid
	if (state.tile.color === 'black') return false;

	let forcedLine = state.players[state.currentPlayer].forcedLine;
	// Check if the move is within range and has a valid path
	return forcedLine
		? findStraightPath(from, to, state, state.players[state.currentPlayer].remainingMoves)
		: findPath(from, to, state.players[state.currentPlayer].remainingMoves);
}

export function findStraightPath(
	start: [number, number],
	end: [number, number],
	state: Room & { tile: any },
	maxSteps: number = 3
): boolean {
	const [q1, r1] = start;
	const [q2, r2] = end;

	const path: { q: number; r: number }[] = [];

	// Determine direction
	const dq = q2 - q1;
	const dr = r2 - r1;

	// Check if the move is in a straight line
	if (dq !== 0 && dr !== 0 && Math.abs(dq) !== Math.abs(dr)) {
		return false;
	}

	// Number of steps to reach the destination

	// Calculate step increments
	const stepQ = dq === 0 ? 0 : dq / maxSteps;
	const stepR = dr === 0 ? 0 : dr / maxSteps;

	// Step through each hex in the line
	for (let i = 1; i <= maxSteps; i++) {
		const currentQ = q1 + stepQ * i;
		const currentR = r1 + stepR * i;

		// Ensure the hex is on the board and not blocked
		const tile = boardData.find((t) => t.q === currentQ && t.r === currentR);
		if (!tile || tile.color === 'black') return false; // Blocked or out of bounds

		path.push({ q: currentQ, r: currentR });
	}

	// Check if the path is valid
	return findPath(start, end, state.players[state.currentPlayer].remainingMoves);
}

export function axialDistance(a: { q: number; r: number }, b: { q: number; r: number }): number {
	return (Math.abs(a.q - b.q) + Math.abs(a.r - b.r) + Math.abs(-a.q - a.r - (-b.q - b.r))) / 2;
}
