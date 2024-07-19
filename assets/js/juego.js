const miModulo = (() => {
    'use strict'

    let deck = [];
    const tipos = ['C', 'D', 'H', 'S'];
    const especiales = ['A', 'J', 'Q', 'K'];

    let puntosJugadores = [];
    let detenidoJugador1 = false;
    let detenidoJugador2 = false;

    const btnPedir1 = document.querySelector('#btnPedir1'),
          btnDetener1 = document.querySelector('#btnDetener1'),
          btnPedir2 = document.querySelector('#btnPedir2'),
          btnDetener2 = document.querySelector('#btnDetener2'),
          btnNuevo = document.querySelector('#btnNuevo'),
          puntosHTML = document.querySelectorAll('small'),
          divCartasJugadores = document.querySelectorAll('.divCartas');

    const iniciaJuego = (numJugadores = 3) => {
        deck = crearDeck();
        puntosJugadores = [];
        detenidoJugador1 = false;
        detenidoJugador2 = false;
        for (let i = 0; i < numJugadores; i++) {
            puntosJugadores.push(0);
        }
        puntosHTML.forEach(elem => elem.innerText = 0);
        divCartasJugadores.forEach(elem => elem.innerHTML = '');
        btnPedir1.disabled = false;
        btnDetener1.disabled = false;
        btnPedir2.disabled = true;
        btnDetener2.disabled = true;
    }

    const crearDeck = () => {
        deck = [];
        for (let i = 2; i <= 10; i++) {
            for (let tipo of tipos) {
                deck.push(i + tipo);
            }
        }
        for (let tipo of tipos) {
            for (let esp of especiales) {
                deck.push(esp + tipo);
            }
        }
        return _.shuffle(deck);  // Utiliza la librería Lodash para mezclar el deck
    }

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'No hay más cartas';
        }
        return deck.pop();
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const valorCarta = (carta) => {
        const valor = carta.substring(0, carta.length - 1);
        return (isNaN(valor)) ? 
               (valor === 'A') ? 11 : 10 
               : valor * 1;
    }

    const acumularPuntos = (carta, turno) => {
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];
        return puntosJugadores[turno];
    }

    const determinaGanador = () => {
        const [puntosJugador1, puntosJugador2, puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            if (puntosJugador1 > 21 && puntosJugador2 > 21 && puntosComputadora > 21) {
                alert('NO HAY GANADOR');
            } else if (puntosComputadora <= 21 &&
                (puntosJugador1 > 21 || puntosComputadora > puntosJugador1) &&
                (puntosJugador2 > 21 || puntosComputadora > puntosJugador2)) {
                alert('KAISA WINS');
            } else if (puntosJugador1 <= 21 &&
                (puntosJugador2 > 21 || puntosJugador1 > puntosJugador2) &&
                (puntosComputadora > 21 || puntosJugador1 > puntosComputadora)) {
                alert('JUGADOR 1 WINS');
            } else if (puntosJugador2 <= 21 &&
                (puntosJugador1 > 21 || puntosJugador2 > puntosJugador1) &&
                (puntosComputadora > 21 || puntosJugador2 > puntosComputadora)) {
                alert('JUGADOR 2 WINS');
            } else {
                alert('NO HAY GANADOR');
            }
        }, 100);
    }

    const turnoComputadora = (puntosMinimos) => {
        let puntosComputadora = 0;
        do {
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            crearCarta(carta, puntosJugadores.length - 1);
        } while ((puntosComputadora < puntosMinimos) && (puntosMinimos <= 21));
        determinaGanador();
    }

    const checkTurnosComputadora = () => {
        if (detenidoJugador1 && detenidoJugador2) {
            turnoComputadora(Math.max(puntosJugadores[0], puntosJugadores[1]));
        }
    };

    const verificarGanador = () => {
        if (detenidoJugador1 && detenidoJugador2) {
            turnoComputadora(Math.max(puntosJugadores[0], puntosJugadores[1]));
        }
    };

    btnPedir1.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
        crearCarta(carta, 0);

        if (puntosJugador > 21) {
            console.warn('Jugador 1 perdió');
            btnPedir1.disabled = true;
            btnDetener1.disabled = true;
            detenidoJugador1 = true;
            btnPedir2.disabled = false;
            btnDetener2.disabled = false;
            verificarGanador();
        }
    });

    btnDetener1.addEventListener('click', () => {
        btnPedir1.disabled = true;
        btnDetener1.disabled = true;
        detenidoJugador1 = true;
        btnPedir2.disabled = false;
        btnDetener2.disabled = false;
        checkTurnosComputadora();
    });

    btnPedir2.addEventListener('click', () => {
        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 1);
        crearCarta(carta, 1);

        if (puntosJugador > 21) {
            console.warn('Jugador 2 perdió');
            btnPedir2.disabled = true;
            btnDetener2.disabled = true;
            detenidoJugador2 = true;
            verificarGanador();
        }
    });

    btnDetener2.addEventListener('click', () => {
        btnPedir2.disabled = true;
        btnDetener2.disabled = true;
        detenidoJugador2 = true;
        checkTurnosComputadora();
    });

    btnNuevo.addEventListener('click', () => {
        console.clear();
        iniciaJuego();
    });

    return {
        nuevoJuego: iniciaJuego 
    }
})();