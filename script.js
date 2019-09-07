const container = document.getElementById('names');
const alphabet = [
	'a', 'b', 'c', 'd', 'e', 'f', 'g',
	'h', 'i', 'j', 'k', 'l', 'm', 'n',
	'o', 'p', 'q', 'r', 's', 't', 'u',
	'v', 'w', 'x', 'y', 'z'
];
const canRepeat = [
	'o', 'e', 'f', 'a', 's'
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
priority.forEach(function (el) {
	if (ignore.includes(el)) {
		console.log(el);
	}
});
const regex = new RegExp('' + priority.join('|') + '', 'gi');
// q,w,y,j,x,z,l
// e,r,t,o,p,a,s,d,f,g,h,k,l,b,v,c,n,m

function generate() {
	// let localAlphabet = [];
	const COEFFICIENT = document.getElementById('factor').value || 1000;
	const exclude = document.getElementById('exclude').value.split(',');

	const localAlphabet = alphabet.reduce(function (prev, el) {
		const value = el.split(' ').join('').toLowerCase();
		if (!exclude.includes(value)) {
			prev.push(value);
		}
		return prev;
	}, []); // it doesnt work

	// console.log(localAlphabet);

	const temp = document.getElementById('firstLetter').value.split(',');
	const firstLetter = temp.reduce(function (prev, el) {
		const value = el.split(' ').join('').toLowerCase();
		if (localAlphabet.includes(value)) {
			prev.push(value);
		}
		return prev;
	}, []);

	let strings = [];

	container.innerHTML = '';
	const amount = document.getElementById('amount').value * COEFFICIENT;
	const length = document.getElementById('length').value || 8;
	for (let i = 0; i < amount; i++) {
		// firstLetter.forEach(function(el) {
			let string = '';
			// const element = document.createElement('div');

			do {
				if (strings.includes(string)) {
					console.log('string is already used, retry..');
				}
				string = '';
				for (let j = 0; j < length; j++) {
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
								consonants.includes(char)
								&&
								consonants.includes(string.charAt(string.length - 1))/* // one consonant: book, fire
								&&
								consonants.includes(string.charAt(string.length - 2)) // two: fly, vent
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

			/*element.classList.add('card');
			element.innerText = string.charAt(0).toUpperCase() + string.slice(1);

			container.appendChild(element);*/
		// });
	}

	
	strings.sort(function (a, b) {
		matches = {
			a: [],
			b: []
		}
		matches.a = a.match(regex) || [];
		matches.b = b.match(regex) || [];

		if (matches.a.length > matches.b.length) {
			// console.log(`${a} (Matches: ${matches.a.join(', ')}) better than ${b} (Matches: ${matches.b.join(', ')})`);
			return -1;
		}

		else return 1;

		if (matches.a.length < matches.b.length) {
			return 1;
		}

		return 0;
	});

	strings.length = amount / COEFFICIENT;

	strings.forEach(function (el) {
		const element = document.createElement('div');
		element.classList.add('card');
		element.innerText = el.charAt(0).toUpperCase() + el.slice(1);
		container.appendChild(element);
	});
}

function random(min, max) {
	let rand = min + Math.random() * (max - min);
	return Math.floor(rand);
}