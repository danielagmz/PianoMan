"use strict";
///////////////////////////////////////////////////////////
// Alumnes: Daniela Gamez i Christian Torres
///////////////////////////////////////////////////////////
let notas = [['KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyA', 'KeyS', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0'],
    ['a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'f2', 'g2', 'a2', 'b2', 'c2', 'd2', 'e2', 'a1s', 'a2s', 'c1s', 'd1s', 'd2s', 'f1s', 'g1s', 'f1s', 'f2s', 'g2s']];
const keyMap = {
    'KeyK': 'KeyR',
    'KeyL': 'KeyT',
    'Semicolon': 'KeyY',
    'KeyQ': 'KeyG',
    'KeyW': 'KeyH',
    'KeyE': 'KeyJ'
};
let teclasActivas = {};
function init() {
    $(document).on('keydown', (event) => {
        if (teclasActivas[event.code])
            return;
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
    $(document).on('keyup', (event) => {
        teclasActivas[event.code] = false;
    });
    $(document).on('touchstart', (event) => {
        for (let i = 0; i < notas[0].length; i++) {
            const target = event.target;
            if (target && target.id === notas[0][i]) {
                activarTecla(notas[0][i], notas[1][i]);
            }
        }
    });
    $(document).on('contextmenu', (event) => {
        event.preventDefault();
    });
    //TouchEmulator();
}
function activarTecla(key, note) {
    const keyElement = $('#' + key);
    keyElement.toggleClass('activa');
    setTimeout(() => {
        keyElement.toggleClass('activa', false);
    }, 500);
    playSound(note);
}
function playSound(key) {
    const sound = new Audio(`assets/${key}.mp3`);
    sound.play();
}
init();
//# sourceMappingURL=PianoMan.js.map