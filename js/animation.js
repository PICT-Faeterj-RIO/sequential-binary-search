cartas = document.querySelector('.cards');

carregarJSON(callback);

document.querySelector('#form').addEventListener('submit', exibirCartas, false);

function exibirCartas(evt) {
	var cenario = obterCenario();
	if(isNaN(cenario[0]) || cenario[0] < 4 || cenario[0] > 13 || cenario[1] == '' || cenario[2] == '' || cenario[3] == '') {
		alert('Preencha corretamente o cenário.');
	} else {
		var imagemInicial = document.querySelector('#playing-cards');
		if(imagemInicial != null) {
			imagemInicial.remove();
		}
		while(cartas.firstChild) {
			cartas.removeChild(cartas.firstChild);
		}
		for(var i = 0; i < cenario[0]; i++) {
			var cartaOculta = document.createElement('img');
			cartaOculta.setAttribute('src', 'img/cards/back.png');
			cartaOculta.setAttribute('class', 'card-padding flipInX animated');
			cartas.appendChild(cartaOculta);
		}
		setTimeout(function(){
			cartas.firstChild.setAttribute('class', 'card-padding animated pulse infinite');
		}, 500);
		cartas.addEventListener('click', iniciarPesquisa, false);
	}
	evt.preventDefault();
}

function iniciarPesquisa(evt) {
	var cenario = obterCenario();
	var cartaAtualClicada = evt.target || evt.srcElement;
	var indiceGuardado = +localStorage.getItem('indiceGuardado');
	if(cartaAtualClicada.className.indexOf('pulse') > 0) {
		if(cenario[3] == 'sequencial-d') {
			buscaDesordenada(cartaAtualClicada);
		}else if(cenario[3] == 'sequencial-o') {
			buscaOrdenada(cartaAtualClicada);
		}
	} else if(ultimaCartaClicada == cenario[1]) {
			alert('Carta já foi encontrada, tente outra busca.. substituir por modal explicativo ...');
	} else if(typeof ultimaCartaClicada !== 'undefined'
		&& ultimaCartaClicada.nextSibling.nextSibling != null
		&& ultimaCartaClicada.nextSibling.nextSibling == cartas.lastChild.previousSibling
		&& !(ultimaCartaClicada.nextSibling.nextSibling.src.indexOf('back') > 0)) {
			alert('Carta não foi encontrada :/, substituir por modal explicativo ...');
	}	else {
			alert('Oops, lembre-se que a busca é sequencial ;), substituir por modal explicativo ...');
	}
}

function buscaOrdenada(cartaAtualClicada) {
	cartaAtualClicada.className = 'card-padding hide';
	var cenario = obterCenario();
	var naipe = obterNaipe();
	var cartaASerMostrada = document.createElement('img');
	var indiceGuardado = +localStorage.getItem('indiceGuardado') || 0;
	cartaASerMostrada.setAttribute('src', naipe[indiceGuardado][0]);
	cartaASerMostrada.setAttribute('class', 'card-padding card-size animated fadeIn');
	cartas.insertBefore(cartaASerMostrada, cartaAtualClicada);
	if(naipe[indiceGuardado][1] == cenario[1]) {
		ultimaCartaClicada = naipe[indiceGuardado][1];
		cartaEncontrada(cartaASerMostrada);
	} else if(naipe[indiceGuardado][1] > cenario[1]) {
		cartaASerMostrada.setAttribute('class', 'card-padding card-size animated fadeIn');
		setTimeout(function() {
			alert('Não é necessário continuar, pois ' + naipe[indiceGuardado][1] + ' é maior do que a carta procurada :/, substituir por modal explicativo ...');
		}, 500);
	} else if(cartaAtualClicada == cartas.lastChild) {
		cartaNaoEncontrada(cartaASerMostrada, cartaAtualClicada);
	} else {
		continuaAProcura(cartaASerMostrada, cartaAtualClicada);
	}
	var ultimoIndiceValido = 8;
	if(indiceGuardado == ultimoIndiceValido || cartaAtualClicada == cartas.lastChild || naipe[indiceGuardado][1] == cenario[1] || naipe[indiceGuardado][1] > cenario[1]) {
		localStorage.clear();
	} else if(getRandomInt(0, 2) == 1 && naipe[indiceGuardado+1][1] == cenario[1]){
		localStorage.setItem('indiceGuardado', indiceGuardado+2);
	} else {
		localStorage.setItem('indiceGuardado', indiceGuardado+1);
	}
	console.log(cenario[1], naipe[indiceGuardado][1]);
}


function buscaDesordenada(cartaAtualClicada) {
	cartaAtualClicada.className = 'card-padding hide';
	var cenario = obterCenario();
	var naipe = obterNaipe();
	var indiceAleatorio = getRandomInt(0,12);
	var cartaASerMostrada = document.createElement('img');
	cartaASerMostrada.setAttribute('src', naipe[indiceAleatorio][0]);
	cartaASerMostrada.setAttribute('class', 'card-padding card-size animated fadeIn');
	cartas.insertBefore(cartaASerMostrada, cartaAtualClicada);
	if(naipe[indiceAleatorio][1] == cenario[1]) {
		ultimaCartaClicada = naipe[indiceAleatorio][1];
		cartaEncontrada(cartaASerMostrada);
	} else if(cartaAtualClicada == cartas.lastChild) {
		cartaNaoEncontrada(cartaASerMostrada, cartaAtualClicada);
	} else {
		continuaAProcura(cartaASerMostrada, cartaAtualClicada);
	}
	console.log(cenario[1], naipe[indiceAleatorio][1]);
}

function cartaEncontrada(cartaASerMostrada) {
	cartaASerMostrada.setAttribute('class', 'card-padding card-size animated jello');
	setTimeout(function() {
		alert('Carta encontrada :), substituir por modal explicativo ...');
	}, 500);
}

function cartaNaoEncontrada(cartaASerMostrada, cartaAtualClicada) {
	setTimeout(function() {
		cartaASerMostrada.setAttribute('class', 'card-padding card-size hide animated fadeOut');
		cartaAtualClicada.setAttribute('class', 'card-padding card-size show animated fadeIn');
		alert('Carta não foi encontrada :/, substituir por modal explicativo ...');
	}, 1500);
}

var ultimaCartaClicada;
function continuaAProcura(cartaASerMostrada, cartaAtualClicada) {
	ultimaCartaClicada = cartaASerMostrada;
	setTimeout(function() {
		cartaAtualClicada.nextSibling.setAttribute('class', 'card-padding animated pulse infinite');
		setTimeout(function(){
			cartaASerMostrada.setAttribute('class', 'card-padding card-size hide animated fadeOut');
			cartaAtualClicada.setAttribute('class', 'card-padding card-size show animated fadeIn');
		}, 1500);
	},100);
}

function obterNaipe() {
	var cenario = obterCenario();
	var naipeSelecionado = jsonObj[cenario[2]];
	var naipe = [];
	for(var i in naipeSelecionado) {
    	naipe.push(naipeSelecionado[i][2]);
			console.log(naipeSelecionado[i][2]);
    	naipe.push(naipeSelecionado[i][3]);
    	naipe.push(naipeSelecionado[i][4]);
    	naipe.push(naipeSelecionado[i][5]);
    	naipe.push(naipeSelecionado[i][6]);
    	naipe.push(naipeSelecionado[i][7]);
    	naipe.push(naipeSelecionado[i][8]);
    	naipe.push(naipeSelecionado[i][9]);
    	naipe.push(naipeSelecionado[i][10]);
			naipe.push(naipeSelecionado[i]['dama']);
		  naipe.push(naipeSelecionado[i]['rei']);
		  naipe.push(naipeSelecionado[i]['valete']);
		  naipe.push(naipeSelecionado[i]['as']);
	}
	return naipe;
}

function obterCenario() {
	var cenario = [+document.querySelector('#size').value,
			document.querySelector('#searched-card')
			.options[document.querySelector('#searched-card').selectedIndex].value,
			document.querySelector('#selected-suit')
			.options[document.querySelector('#selected-suit').selectedIndex].value,
			document.querySelector('#type-of-search')
			.options[document.querySelector('#type-of-search').selectedIndex].value
			];
	return cenario;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function carregarJSON(callback) {
	var request = new XMLHttpRequest();
	request.onload = function() {
		console.log(request.response, request.status);
		callback(request.response);
	}
	request.open('GET', 'https://api.myjson.com/bins/bj79p');
	request.responseType = 'json';
	request.send();
}

var jsonObj;
function callback(result) {
	jsonObj = result;
}
