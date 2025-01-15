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

function backButton(){
	$('#back').on('click', () => {
		location.reload();
	});
}

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
function gameInit() {
	//TouchEmulator();
	$(document).on('keydown', (event: KeyboardEvent) => {
		if (teclasActivas[event.code]) return;
		teclasActivas[event.code] = true;

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

function activarTecla(key: string, note: string) {
	const keyElement = $('#' + key);
	keyElement.toggleClass('activa');
	setTimeout(() => {
		keyElement.toggleClass('activa', false);
	}, 500);
	playSound(note);
}

function playSound(key: string) {
	const sound = new Audio(`assets/${key}.mp3`);
	sound.play();
}

// Función para generar las notas dentro del SVG
function generatePianoTiles(svgElement: SVGSVGElement, notes: Note[]) {
	const svgNS = "http://www.w3.org/2000/svg"; // Namespace SVG

	// Función para crear una nota
	function createNoteElement(note: string, y: number): SVGRectElement {
		const rect = document.createElementNS(svgNS, "rect");
		rect.setAttribute("id", "nota"); // Identificador de la nota
		rect.setAttribute("x", getXPosition(note)); // Obtener posición X según la nota
		rect.setAttribute("y", y.toString()); // Posición inicial en Y
		rect.setAttribute("width", "45"); // Ancho del rectángulo
		rect.setAttribute("height", "20"); // Altura del rectángulo
		rect.setAttribute("fill", "yellow"); // Color de la nota
		return rect;
	}

	// Mapeo de notas a posiciones X
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
			const noteElement = createNoteElement(note, -20); // Y inicial es -20 para que aparezca por encima del piano
			svgElement.appendChild(noteElement);

			// Animar la nota para que descienda
			animateNote(noteElement);
		}, time);
	});

	// Función para animar las notas hacia abajo
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
