const BODY = document.body;
const MODE_BTN = document.querySelector('#mode');
const ROLL_MODAL = document.querySelector('#roll');
const FORM_MODAL = document.querySelector('#editStat');
const STAT_FORM = document.querySelector('#statForm');
const ROLLED_SLOT = document.querySelector('#rolled');
const DICE_SLOT = document.querySelector('#dice');
const RESULT_SLOT = document.querySelector('#result');

const STATS_STORE = JSON.parse(localStorage.getItem('stats')) || {};
setMode(localStorage.getItem('mode') || 'edit');

for (const [stat, value] of Object.entries(STATS_STORE)) {
	createStatButton(stat, value);
}

MODE_BTN.addEventListener('click', switchMode);
MODE_BTN.addEventListener('touch', switchMode);

for (const dice of document.querySelectorAll('.dice')) {
	dice.addEventListener('click', rollDice);
	dice.addEventListener('touch', rollDice);
}

for (const stat of document.querySelectorAll('.stat')) {
	stat.addEventListener('click', clickStat);
	stat.addEventListener('touch', clickStat);
}

ROLL_MODAL.addEventListener('click', closeRoll);
ROLL_MODAL.addEventListener('touch', closeRoll);

function createStatButton(stat, value) {
	const newBtn = document.createElement('button');
	document.querySelector('#stats').append(newBtn);
	newBtn.dataset.stat = stat;
	newBtn.dataset.value = value;
	newBtn.addEventListener('click', clickStat);
	newBtn.addEventListener('touch', clickStat);
	const s = document.createElement('strong');
	const e = document.createElement('em');
	newBtn.classList.add('stat');
	s.innerText = stat;
	e.innerText = `(${value})`;
	newBtn.append(s);
	newBtn.append(e);
	newBtn.dataset.stat = stat;
	newBtn.dataset.value = value;
}

function rollDice(event) {
	const SIDES = event.target.dataset.sides;
	const ROLLED = Math.ceil(Math.random() * SIDES);
	ROLLED_SLOT.innerText = `1D${SIDES}`;
	DICE_SLOT.innerText = ROLLED;
	RESULT_SLOT.innerText = '';
	ROLL_MODAL.showModal();
}

function clickStat(event) {
	switch (BODY.dataset.mode) {
		case 'roll':
			rollStat(event);
			break;
		case 'delete':
			removeStat(event);
			break;
		case 'edit':
			editStat(event);
			break;
	}
}

function rollStat(event) {
	const GOAL = event.target.dataset.value;
	const ROLLED = Math.ceil(Math.random() * 100);
	ROLLED_SLOT.innerText = event.target.dataset.stat;
	DICE_SLOT.innerText = ROLLED;
	let result = '';
	if (ROLLED <= 5) {
		result = 'Réussite critique';
		RESULT_SLOT.className = 'critHit';
	} else if (ROLLED > 95) {
		result = 'Echec critique';
		RESULT_SLOT.className = 'critFail';
	} else if (ROLLED <= GOAL) {
		result = 'Réussite';
		RESULT_SLOT.className = 'hit';
	} else {
		result = 'Echec';
		RESULT_SLOT.className = 'fail';
	}
	RESULT_SLOT.innerText = result;
	ROLL_MODAL.showModal();
}

function editStat(event) {
	STAT_FORM.querySelector('[name=edit]').value = event.target.dataset.stat;
	STAT_FORM.querySelector('[name=stat]').value = event.target.dataset.stat;
	STAT_FORM.querySelector('[name=value]').value = event.target.dataset.value;
	FORM_MODAL.showModal(event.target);
}

STAT_FORM.addEventListener('submit', saveStat);

function saveStat(event) {
	event.preventDefault();
	const fd = new FormData(STAT_FORM);
	let edited;
	if (fd.get('edit') != '') {
		edited = document.querySelector(`[data-stat=${fd.get('edit')}]`);
		edited.remove();
		delete STATS_STORE[fd.get('edit')];
	}
	createStatButton(fd.get('stat'), fd.get('value'));
	STATS_STORE[fd.get('stat')] = fd.get('value');
	localStorage.setItem('stats', JSON.stringify(STATS_STORE));
	FORM_MODAL.close();
}

function removeStat(event) {
	if (
		!confirm(
			`Êtes-vous sûr de vouloir supprimer ${event.target.dataset.stat} ?`
		)
	) {
		return;
	}
	delete STATS_STORE[event.target.dataset.stat];
	localStorage.setItem('stats', JSON.stringify(STATS_STORE));
	event.target.remove();
}

function closeRoll() {
	ROLL_MODAL.close();
}

function switchMode() {
	switch (BODY.dataset.mode) {
		case 'edit':
			setMode('roll');
			break;
		case 'roll':
			setMode('delete');
			break;
		case 'delete':
			setMode('edit');
			break;
	}
}

function setMode(mode) {
	switch (mode) {
		case 'edit':
			MODE_BTN.innerText = '✏️';
			BODY.dataset.mode = 'edit';
			localStorage.setItem('mode', 'edit');
			break;
		case 'roll':
			MODE_BTN.innerText = '🎲';
			BODY.dataset.mode = 'roll';
			localStorage.setItem('mode', 'roll');
			break;
		case 'delete':
			MODE_BTN.innerText = '❌';
			BODY.dataset.mode = 'delete';
			localStorage.setItem('mode', 'delete');
			break;
	}
}
