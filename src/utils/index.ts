export function randomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export async function sleep(ms: number) {
	return await new Promise(
		(resolve) => {
			setTimeout(resolve, ms);
		}
	);
}
