let worker = new Worker('worker.js');
worker.onmessage = function(e) {
	if (e.data.id === 'TASK_GENERATE_DONE') {
		show(e.data.data);
	}
};
const container = document.getElementById('names');

document.querySelector('button').onclick = generate;

let amount;

function generate() {
	container.innerHTML = '<p class="lead">Generating names. This may take a while..</p>';
	const COEFFICIENT = document.getElementById('factor').value || 1000;
	const exclude = document.getElementById('exclude').value.split(',');
	const temp = document.getElementById('firstLetter').value.split(',');

	amount = document.getElementById('amount').value || 10;
	worker.postMessage({
		id: 'TASK_GENERATE',
		options: {
			amount,
			factor: COEFFICIENT,
			length: document.getElementById('length').value || 8,
			exclude,
			temp
		}
	});
}

async function show(strings) {
	let available = 0;

	function status(domain) {
		return (domain.available === 'yes') ? true : false
	}

	for (const name of strings) {
		if (available == amount) {
			console.info(`Reached ${available} available domains`);
			break;
		}

		const response = await Promise.all([
			fetch(`https://api.whois.vu/?q=${name}.ru`),
			fetch(`https://api.whois.vu/?q=${name}.com`)
		]);
		let [ru, com] = await Promise.all( response.map(json => json.json()) );
		ru = status(ru);
		com = status(com);
		if (ru || com) {
			if (available === 0) {
				container.innerHTML = '';
			}
			render({ name, ru, com });
			available++;
		}
	}
}

function render({ name, ru, com }) {
	function badge(status) {
		return `
			<span class="badge badge-pill ${status ? 'badge-success' : 'badge-danger'}">
				${status ? 'OK' : 'Used'}
			</span>
		`;
	}

	const element = document.createElement('div');
	element.classList.add('card', 'm-2', 'flex-grow-1', 'bg-light', 'text-dark');
	element.innerHTML = `
		<h3 class="card-header">
			${name.charAt(0).toUpperCase() + name.slice(1)}
		</h3>
		<ul class="list-group list-group-flush">
			<li class="list-group-item">
				${name}.ru
				${badge(ru)}
			</li>
			<li class="list-group-item">
				${name}.com
				${badge(com)}
			</li>
		</ul>
	`;
	container.appendChild(element);
}