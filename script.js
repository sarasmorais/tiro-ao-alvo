

const tela = document.querySelector('canvas');
const pincel = tela.getContext('2d');
const scoreBoard = document.getElementById('scoreBoard');
const messageArea = document.getElementById('messageArea');
const startButton = document.getElementById('startButton');


const raioBase = 10;
const larguraCanvas = 600;
const alturaCanvas = 400;
let xAleatorio;
let yAleatorio;
let pontuacao = 0;
let jogoAtivo = false;
let intervaloAlvo;
const tempoIntervalo = 1200;


const corFundoCanvas = '#f4f6f7';
const corAlvoExterno = '#e74c3c';
const corAlvoMeio = '#ffffff';
const corAlvoInterno = '#c0392b';


function desenhaFundo() {
    pincel.fillStyle = corFundoCanvas;
    pincel.fillRect(0, 0, larguraCanvas, alturaCanvas);
}

function desenhaCirculo(x, y, raio, cor) {
    pincel.fillStyle = cor;
    pincel.beginPath();
    pincel.arc(x, y, raio, 0, 2 * Math.PI);
    pincel.fill();
}

function desenhaAlvo(x, y) {

    desenhaCirculo(x, y, raioBase + 20, corAlvoExterno);
    desenhaCirculo(x, y, raioBase + 10, corAlvoMeio);
    desenhaCirculo(x, y, raioBase, corAlvoInterno);
}


function limpaTela() {

    pincel.clearRect(0, 0, larguraCanvas, alturaCanvas);
}

function sorteiaPosicao(maximoDimensao, raioAlvo) {

    const margemSeguranca = raioAlvo + 25;

    return Math.floor(Math.random() * (maximoDimensao - 2 * margemSeguranca)) + margemSeguranca;
}

function atualizaAlvo() {
    if (!jogoAtivo) return;

    limpaTela();
    desenhaFundo();

    xAleatorio = sorteiaPosicao(larguraCanvas, raioBase + 20);
    yAleatorio = sorteiaPosicao(alturaCanvas, raioBase + 20);
    desenhaAlvo(xAleatorio, yAleatorio);
}

function atualizaPontuacaoDisplay() {
    scoreBoard.textContent = 'Pontuação: ' + pontuacao;
}

function mostraMensagem(msg, cor = 'green', duracao = 1500) {
    messageArea.textContent = msg;
    messageArea.style.color = cor;

    setTimeout(() => {
        if (messageArea.textContent === msg) {
            messageArea.textContent = '';
        }
    }, duracao);
}

function dispara(evento) {
    if (!jogoAtivo) return;

    const rect = tela.getBoundingClientRect();
    const x = evento.clientX - rect.left;
    const y = evento.clientY - rect.top;


    const distancia = Math.sqrt(Math.pow(x - xAleatorio, 2) + Math.pow(y - yAleatorio, 2));


    if (distancia < raioBase + 20) {
        let acertouMsg = '';
        let corMsg = 'green';

        if (distancia < raioBase) {
            pontuacao += 10;
            acertouMsg = 'ACERTOU EM CHEIO!';
            corMsg = '#2980b9';
        } else if (distancia < raioBase + 10) {
            pontuacao += 5;
            acertouMsg = 'Bom tiro!';
            corMsg = '#27ae60';
        } else {
            pontuacao += 1;
            acertouMsg = 'Na mosca!';
            corMsg = '#f39c12';
        }

        mostraMensagem(acertouMsg, corMsg);
        atualizaPontuacaoDisplay();


        clearInterval(intervaloAlvo);
        atualizaAlvo(); // Novo alvo aparece instantaneamente
        intervaloAlvo = setInterval(atualizaAlvo, tempoIntervalo);
    } else {

        mostraMensagem('Errou! Tente de novo.', 'red');
        pontuacao -= 1; // Se quiser penalizar por erro
        atualizaPontuacaoDisplay();
    }
}

function iniciarJogo() {
    pontuacao = 0;
    atualizaPontuacaoDisplay();
    jogoAtivo = true;
    startButton.textContent = 'Reiniciar Jogo';
    messageArea.textContent = '';

    desenhaFundo();
    atualizaAlvo();


    if (intervaloAlvo) {
        clearInterval(intervaloAlvo);
    }

    intervaloAlvo = setInterval(atualizaAlvo, tempoIntervalo);
}


tela.addEventListener('click', dispara);
startButton.addEventListener('click', iniciarJogo);


function mostrarTelaInicial() {
    desenhaFundo();
    pincel.fillStyle = '#2c3e50';
    pincel.font = 'bold 22px "Segoe UI"';
    pincel.textAlign = 'center';
    pincel.fillText('Clique em "Iniciar Jogo" para começar!', larguraCanvas / 2, alturaCanvas / 2 - 15);
    pincel.font = '16px "Segoe UI"';
    pincel.fillText('Acerte o alvo para ganhar pontos.', larguraCanvas / 2, alturaCanvas / 2 + 15);
    startButton.disabled = false;
    startButton.textContent = 'Iniciar Jogo';
}


window.onload = () => {
    mostrarTelaInicial();
};
