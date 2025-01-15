import "https://code.jquery.com/jquery-3.7.1.js";
declare const $: any;

import { notes } from "./notes.js";
import { Note } from "./interfaces.js";

///////////////////////////////////////////////////////////
// Alumnes: Daniela Gamez i Christian Torres
///////////////////////////////////////////////////////////

let notas = [['KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyA', 'KeyS', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'f2', 'g2', 'a2', 'b2', 'c2', 'd2', 'e2', 'a1s', 'a2s', 'c1s', 'd1s', 'd2s', 'f1s', 'g1s', 'f1s', 'f2s', 'g2s']];
const keyMap: { [key: string]: string } = {
	'KeyK': 'KeyR',
	'KeyL': 'KeyT',
	'Semicolon': 'KeyY',
	'KeyQ': 'KeyG',
	'KeyW': 'KeyH',
	'KeyE': 'KeyJ'
};

let teclasActivas: { [key: string]: boolean } = {};

/**
 * Inicialitza els esdeveniments dels botons "Lliure" i "Canço"
 * Mostra o amaga els elements HTML corresponents
 * Crida les funcions selectSong() segons el cas i gameInit() per a iniciar el piano
 */
function init() {
	$('#freeStyle').on('click', () => {
		$('#menu').hide();
		$('#piano').show();
		$('#back').show();
		gameInit();

	})

	$('#song').on('click', () => {
		$('#menu').hide();
		$('#songList').show();
		$('#back').show();
		selectSong();
	})
	backButton();
}

/**
 * Event listener per al bot  "Atras" per tornar al menu  principal
 */
function backButton(){
	$('#back').on('click', () => {
		location.reload();
	});
}

/**
 * Mostra el menu de cançons 
 * Amaga el llistat de cançons i mostra el piano quan es seleciona una 
 * Crida la funcio  gameInit() per a iniciar el piano i 
 * generatePianoTiles() per a mostrar els canals de notes
 */
function selectSong() {
	$('#corderito').on('click', () => {
		$('#songList').hide();
		$('#piano').show();
		$('#pianoTile').show();
		gameInit();

		const svg = document.getElementById("pianoTile") as unknown as SVGSVGElement;
		generatePianoTiles(svg, notes);
	});
}
/**
 * Inicialitza el joc
 * Afegeix esdeveniments per a que quan es premi una tecla, es cridi la funcio  activarTecla()
 * amb el codi de la tecla i la nota corresponent
 * Tambe  desactiva el menu  contextual
 */
function gameInit() {
	//TouchEmulator();
	// cuando se presiona una tecla se agrega la tecla al array y en caso de que ya este no hace nada
	$(document).on('keydown', (event: KeyboardEvent) => {
		if (teclasActivas[event.code]) return;
		teclasActivas[event.code] = true;
		
		// si ha pulsado la tecla auxiliar pone la clase activa a la tecla y el sonido correspondiente
		const index = notas[0].indexOf(keyMap[event.code]);
		if (index !== -1) {
			activarTecla(keyMap[event.code], notas[1][index]);
		}
		for (let i = 0; i < notas[0].length; i++) {
			if (event.code === notas[0][i]) {
				activarTecla(notas[0][i], notas[1][i]);
			}
		}

	});

	$(document).on('keyup', (event: KeyboardEvent) => {
		teclasActivas[event.code] = false;
	});

	$(document).on('touchstart', (event: TouchEvent) => {
		for (let i = 0; i < notas[0].length; i++) {
			const target = event.target as HTMLElement;
			if (target && target.id === notas[0][i]) {
				activarTecla(notas[0][i], notas[1][i]);

			}
		}
	});

	$(document).on('contextmenu', (event: Event) => {
		event.preventDefault();
	});
}

/**
 * Activa la tecla i el seu so. Afegeix la classe "activa" a la tecla i la treu al cap de 500ms.
 * @param {string} key - Identificador de la tecla.
 * @param {string} note - Nom de la nota de so corresponent.
 */
function activarTecla(key: string, note: string) {
	const keyElement = $('#' + key);
	keyElement.toggleClass('activa');
	setTimeout(() => {
		keyElement.toggleClass('activa', false);
	}, 500);
	playSound(note);
}

/**
 * Reprodueix el so de la nota amb la clau key.
 * @param {string} key - Clau de la nota.
 */
function playSound(key: string) {
	const sound = new Audio(`assets/${key}.mp3`);
	sound.play();
}


/**
 * Genera las notas del piano en el elemento SVG con el id pasado.
 * Crea un elemento "rect" por cada nota y lo agrega al elemento SVG.
 * El elemento "rect" tiene la clase "nota" y se le asigna una posición X
 * y una posición Y de -20 para que aparezca por encima de los canales del piano.
 * La nota se anima para que descienda y se elimina cuando sale del área visible.
 * @param {SVGSVGElement} svgElement - Elemento SVG donde se dibujarán las notas.
 * @param {Note[]} notes - Array de objetos con la estructura { note: string, time: number }
 */
function generatePianoTiles(svgElement: SVGSVGElement, notes: Note[]) {
	const svgNS = "http://www.w3.org/2000/svg"; 

	
/**
 * Crea un elemento "rect" para una nota en el piano.
 * @param {string} note - Nota (do, re, mi, ...)
 * @param {number} y - Posición Y de la nota
 * @returns {SVGRectElement} Elemento "rect" creado
 */
	function createNoteElement(note: string, y: number): SVGRectElement {
		const rect = document.createElementNS(svgNS, "rect");
		rect.setAttribute("id", "nota"); 
		rect.setAttribute("x", getXPosition(note)); 
		rect.setAttribute("y", y.toString()); 
		rect.setAttribute("width", "45"); 
		rect.setAttribute("height", "20"); 
		rect.setAttribute("fill", "yellow"); 
		return rect;
	}

	
	/**
	 * Convierte una nota en su posición X en el piano.
	 * @param {string} note - Nota (do, re, mi, ...)
	 * @returns {string} Posición X de la nota en formato string. Si la nota no existe, devuelve "0".
	 */
	function getXPosition(note: string): string {
		const positions: Record<string, number> = {
			"do": 0,
			"re": 46,
			"mi": 91,
			"fa": 136,
			"sol": 182,
			"la": 226,
			"si": 271,
			"do2": 316,
			"re2": 361,
			"mi2": 406,
			"fa2": 451,
			"sol2": 496,
			"la2": 541,
			"si2": 586,
		};
		return positions[note]?.toString() || "0";
	}

	// Agregar cada nota al SVG en el tiempo indicado
	notes.forEach(({ note, time }) => {
		setTimeout(() => {
			const noteElement = createNoteElement(note, -20); // Y inicial es -20 para que aparezca por encima de los canales del piano
			svgElement.appendChild(noteElement);

			// Animar la nota para que descienda
			animateNote(noteElement);
		}, time);
	});

	
	/**
	 * Animar una nota para que descienda.
	 * 
	 * La funció crea un interval que cada 16 milisegons 
	 * fa que la nota baixi 2 píxels en la seva posició Y.
	 * 
	 * Si la nota surt de l'àrea visible, se l'elimina del SVG.
	 * @param {SVGRectElement} noteElement - Element <rect> de la nota a animar.
	 */
	function animateNote(noteElement: SVGRectElement) {
		let y = -20;
		const interval = setInterval(() => {
			y += 2; // Incremento de la posición Y
			noteElement.setAttribute("y", y.toString());

			// Si la nota sale del área visible, la eliminamos
			if (y > svgElement.clientHeight) {
				svgElement.removeChild(noteElement);
				clearInterval(interval);
			}
		}, 16);
	}
}



// Funcion para comprobar si el usuario le ha dado a las teclas correctas
function checkKey(svgElement: SVGSVGElement, notes: Note[]) {
	const piano = (document.getElementById("piano") as unknown as SVGSVGElement).getBoundingClientRect();
	$("rect[id^='nota']").each((i: number, e: SVGAElement) => {
		if (!e.parentNode) return; // Saltar si la nota no existe
		const notaRec = e.getBoundingClientRect();


	});
}


// estetico

/**
 * Genera "notas musicales" en el fondo de la pantalla
 * 
 * @param {number} count Número de notas que se van a generar
 * @param {string} className Clase CSS para el elemento <div> que representará la nota
 */
$(document).ready(function () {
	const generateNotes = (count: number, className: string) => {
		const notes = ['♪', '♫', '♬', '♩', '♭', '♯']; // Notas musicales
		for (let i = 0; i < count; i++) {
			const x = Math.random() * 2000;
			const y = Math.random() * 2000;
			const randomNote = notes[Math.floor(Math.random() * notes.length)];
			$('body').append(
				$('<div></div>')
					.addClass('notes')
					.addClass(className)
					.css({ top: `${y}px`, left: `${x}px` })
					.text(randomNote)
			);
		}


	};
	generateNotes(200, 'small');
	generateNotes(100, 'medium');
	generateNotes(20, 'big');
});




init();
