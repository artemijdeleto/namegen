const alphabet = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g',
	'h', 'i', 'j', 'k', 'l', 'm', 'n',
	'o', 'p', 'q', 'r', 's', 't', 'u',
	'v', 'w', 'x', 'y', 'z'
];

const canRepeat = [
	'o', 'e', 'f', 's'
];

const consonants = [
	'b', 'c', 'd', 'f', 'g', 'h',
	'j', 'k', 'l', 'm', 'n', 'p',
	'q', 'r', 's', 't', 'v', 'w', 'x', 'z'
];

const priority = Array.from(new Set([
	'ar', 'ae', 'af',
	'br', 'bo', 'be', 'bu',
	'ca', 'cl', 'ce', 'cu', 'cr',
	'de', 'do',
	'ft', 'fe', 'fo', 'fi', 'fl',
	'go', 'ge', 'ga',
	'ko', 'ka', 'ke',
	'os', 'on', 'oo', 'op', 'or',
	're', 'ro', 'ra', 'ru',
	'sc', 'st', 'si', 'so', 'sa', 'sh', 'sch',
	'th', 'tr', 'ta', 'te',
	'no', 'ne', 'ny',
	//
	'bl', 'cl', 'fl', 'gl', 'pl',
	'sl', 'br', 'cr', 'dr', 'fr',
	'gr', 'pr', 'tr', 'sc', 'sk',
	'sm', 'sn', 'sp', 'st', 'sw', 'tw'
	// 'ur'
]));

const ignore = [
	'tg', 'vf', 'ls', 'vb', 'sz',
	'fb', 'tm', 'hk', 'ht', 'kt',
	'kb', 'tb', 'bk', 'pn', 'rg',
	'cg', 'bt', 'lb', 'gv', 'bp',
	'bf', 'pk', 'df', 'gm', 'hm',
	'fh', 'pv', 'cd', 'dp', 'dt',
	'vp', 'fv', 'jf', 'jn', 'jp',
	'db',
	'snm', 'rnr', 'rcf', 'sfs',
	'vcp', 'mtn', 'fnm', 'crp',
	'scs', 'svm', 'src', 'sbr',
	'snr', 'snp', 'pfr', 'mrt',
	'rtn', 'mfc', 'sns',
	'mnm', 'svs'
];

self.onmessage = function(e) {
	if (e.data.id === 'TASK_GENERATE') {
		const result = generate(e.data.options);
		self.postMessage({
			id: 'TASK_GENERATE_DONE',
			data: result
		});
	}
};

priority.forEach(function (el) {
	if (ignore.includes(el)) {
		console.log(el);
	}
});
const regex = new RegExp('' + priority.join('|') + '', 'gi');

function random(min, max) {
	let rand = min + Math.random() * (max - min);
	return Math.floor(rand);
}

function generate(options) {
	const strings = [];

	const localAlphabet = alphabet.reduce(function (prev, el) {
		const value = el.split(' ').join('').toLowerCase();
		if (!options.exclude.includes(value)) {
			prev.push(value);
		}
		return prev;
	}, []); // it doesnt work

	const firstLetter = options.temp.reduce(function (prev, el) {
		const value = el.split(' ').join('').toLowerCase();
		if (localAlphabet.includes(value)) {
			prev.push(value);
		}
		return prev;
	}, []);

	function factorial(length) {
		let result = 1;
		for (let i = 0; i < length; i++) {
			result *= localAlphabet.length - i;
		}
		return result;
	}

	const iterations = Math.min(
						factorial(options.length),
						options.amount * options.factor
					);
	console.info(`Number of words with ${options.length} characters: ${factorial(options.length)}`);
	console.info(`Number of iterations using factor: ${options.amount * options.factor}`);
	console.info(`We'll use ${iterations} iterations`);
	top:
	for (let i = 0; i < iterations; i++) {
		let string = '';
		let recursion = 0;

		do {
			if (strings.includes(string)) {
				if (recursion > 1) {
					console.warn('Retried for too many times, leaving loop..');
					break top;
				}
				recursion++;
				console.info(`Name ${string} is already used, retry..`);
			}
			string = '';
			for (let j = 0; j < options.length; j++) {
				let char = '';
				// debugger;
				do {
					char = localAlphabet[random(0, localAlphabet.length)];
				} while (
						( j == 0 && (firstLetter.length > 0 && !firstLetter.includes(char)) )
						||
						(
							( string.charAt(string.length - 1) == char && !canRepeat.includes(char) )
							||
							( string.charAt(string.length - 2) == char && string.charAt(string.length - 1) == char)
						)
						||
						( ignore.includes('' + string.slice(string.length - 1) + char) )
						||
						( ignore.includes('' + string.slice(string.length - 2) + char) )
						||
						(
							(
								consonants.includes(char)
								&&
								consonants.includes(string.charAt(string.length - 1)) // one consonant: book, fire
							)
							&&
							(
								consonants.includes(char)
								&&
								consonants.includes(string.charAt(string.length - 1))
								&&
								consonants.includes(string.charAt(string.length - 2))  // two: fly, vent
							)
							&&
							(
								consonants.includes(char)
								&&
								consonants.includes(string.charAt(string.length - 1))
								&&
								consonants.includes(string.charAt(string.length - 2))
								&&
								consonants.includes(string.charAt(string.length - 3))  // two: fly, vent
							)
							/*
							&&
							consonants.includes(string.charAt(string.length - 3))
							&&
							consonants.includes(string.charAt(string.length - 4))*/
						)
					)
				string += char;
			}
		} while (strings.includes(string))

		strings.push(string);
	}

	strings.sort(function (a, b) {
		const matches = {
			a: [],
			b: []
		}
		matches.a = a.match(regex) || [];
		matches.b = b.match(regex) || [];

		if (matches.a.length > matches.b.length) {
			return -1;
		}

		if (matches.a.length < matches.b.length) {
			return 1;
		}

		return 0;
	});

	return strings;
}