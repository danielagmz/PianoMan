declare const $: any;

///////////////////////////////////////////////////////////
// Alumnes: Daniela Gamez i Christian Torres
///////////////////////////////////////////////////////////
let notas = [['d', 'f', 'g', 'h', 'j', 'a', 's'], 
			['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1']];

function init() {
	//TouchEmulator();
	$(document).on('keydown',(event:KeyboardEvent) => {
		for (let i = 0; i < notas[0].length; i++) {
			if (event.key === notas[0][i]) {
				const keyElement = $('#k' + notas[0][i]);
            	keyElement.addClass('activa');
            	setTimeout(() => {
                	keyElement.removeClass('activa');
            	}, 500);
				playSound(notas[1][i]);
			}	
		}
	});
	
	$(document).on('touchstart', (event:TouchEvent) => {
		for (let i = 0; i < notas[0].length; i++) {
			const target = event.target as HTMLElement;
			if (target && target.id === 'k' + notas[0][i]) {
				const keyElement = $('#k' + notas[0][i]);
				keyElement.addClass('activa');
				setTimeout(() => {
					keyElement.removeClass('activa');
					}, 500);
				playSound(notas[1][i]);
			}
		}
	});
	
}
function playSound(key:string) {
	const sound = new Audio(`assets/${key}.mp3`);
	sound.play();
}


init();
