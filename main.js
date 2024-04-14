const BODY = document.body;
const MODE_BTN = document.querySelector('#mode');
const ROLL_MODAL = document.querySelector('#roll');
const FORM_MODAL = document.querySelector('#editStat');
const STAT_FORM = document.querySelector('#statForm');

MODE_BTN.addEventListener('click', switchMode);
MODE_BTN.addEventListener('touch', switchMode);

for (let dice of document.querySelectorAll('.dice')) {
	dice.addEventListener('click', rollDice);
	dice.addEventListener('touch', rollDice);
}

for (let stat of document.querySelectorAll('.stat')) {
	stat.addEventListener('click', clickStat);
	stat.addEventListener('touch', clickStat);
}

ROLL_MODAL.addEventListener('click', closeRoll);
ROLL_MODAL.addEventListener('touch', closeRoll);

function rollDice(event) {
	const SIDES = event.target.dataset.sides;
	const ROLLED = Math.ceil(Math.random() * SIDES);
	ROLL_MODAL.innerText = `Vous avez lancé 1D${SIDES} et obtenu : ${ROLLED}`;
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
	const STAT = event.target.dataset.stat;
	const GOAL = event.target.dataset.value;
	const ROLLED = Math.ceil(Math.random() * 100);
	ROLL_MODAL.innerText = `Vous avez fait un jet de ${STAT} et obtenu : ${ROLLED} < ${GOAL} ?`;
	ROLL_MODAL.showModal();
}

function editStat(event) {
	console.log(event);
	STAT_FORM.querySelector('[name=edit]').value = event.target.dataset.stat;
	STAT_FORM.querySelector('[name=stat]').value = event.target.dataset.stat;
	STAT_FORM.querySelector('[name=value]').value = event.target.dataset.value;
	FORM_MODAL.showModal(event.target);
}

STAT_FORM.addEventListener('submit', saveStat);

function saveStat(event) {
	event.preventDefault();
	let fd = new FormData(STAT_FORM);
	let edited;
	if (fd.get('edit') == '') {
		edited = document.createElement('button');
		document.querySelector('#stats').append(edited);
		edited.dataset.stat = fd.get('stat');
		edited.dataset.value = fd.get('value');
		edited.addEventListener('click', clickStat);
		edited.addEventListener('touch', clickStat);
	} else {
		edited = document.querySelector(`[data-stat=${fd.get('edit')}]`);
		edited.innerHTML = '';
	}
	let s = document.createElement('strong');
	let e = document.createElement('em');
	edited.classList.add('stat');
	s.innerText = `${fd.get('stat')}`;
	e.innerText = `(${fd.get('value')})`;
	edited.append(s);
	edited.append(e);
	edited.dataset.stat = fd.get('stat');
	edited.dataset.value = fd.get('value');
	FORM_MODAL.close();
}

function removeStat(event) {
	if (
		confirm(
			`Êtes-vous sûr de vouloir supprimer ${event.target.dataset.stat} ?`
		)
	) {
		event.target.remove();
	}
}

function closeRoll() {
	ROLL_MODAL.close();
}

function switchMode() {
	switch (MODE_BTN.innerText) {
		case '✏️':
			MODE_BTN.innerText = '🎲';
			BODY.dataset.mode = 'roll';
			break;
		case '🎲':
			MODE_BTN.innerText = '❌';
			BODY.dataset.mode = 'delete';
			break;
		case '❌':
			MODE_BTN.innerText = '✏️';
			BODY.dataset.mode = 'edit';
			break;
	}
}
