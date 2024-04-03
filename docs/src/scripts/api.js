async function exibirTextoNaTela(tag, texto) {
  let campo = document.querySelector(tag);
  campo.innerHTML = texto;
  responsiveVoice.speak(texto, 'Brazilian Portuguese Male', {rate:2.5});
}

const routes = {
  champions: "https://cors-proxy.fringe.zone/http://sdw24.sa-east-1.elasticbeanstalk.com/champions",
  ask: "https://cors-proxy.fringe.zone/http://sdw24.sa-east-1.elasticbeanstalk.com/champions/{id}/ask",
};

// cors alternativos ==> https://cors-anywhere.herokuapp.com/ 
// https://cors-server.fly.dev/ ou https://cors-proxy.fringe.zone/

const apiService = {
  async getChampions() {
    const route = routes.champions;
    const response = await fetch(route);
    return await response.json();
  },
  async postAskChampion(id, message) {
    const route = routes.ask.replace("{id}", id);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question: message}),
    };

    const response = await fetch(route, options);
    return await response.json();
  },    
};

const state = {
  values: {
    champions: [],
  },
  views: {
    response: document.querySelector(".text-reponse"),
    question: document.getElementById("text-request"),
    avatar: document.getElementById("avatar"),
    carousel: document.getElementById("carousel-cards-content"),
  },
};

async function main() {  
  await loadChampions(); 
  await renderChampions();  
  await loadCarrousel();
}


async function loadChampions() {
  const data = await apiService.
  getChampions();
  state.values.champions = data;
}

async function renderChampions() {
  const championsData = state.values.champions;
  const elements = championsData.map(
    (character) =>
    `<div class="timeline-carousel__item"
    onclick="onChangeChampionSelected(${character.id}, '${character.imageUrl}')">
    <div class="timeline-carousel__image">
      <div class="media-wrapper media-wrapper--overlay"
        style="background: url('${character.imageUrl}') center center; background-size:cover;">
      </div>
    </div>
    <div class="timeline-carousel__item-inner">
      <span class="name">${character.name}</span>
      <span class="role">${character.role}</span>
      <p>${character.lore}./p>
    </div>
  </div>`
  );

  state.views.carousel.innerHTML = elements.join("");
}

//1. Trocar a imagem de fundo do avatar
//2. Guard o id do personagem selecionado
//3. Resetar a tela
async function onChangeChampionSelected(id, imageUrl) {
  state.views.avatar.style.backgroundImage = `url('${imageUrl}')`;
  state.views.avatar.dataset.id = id;

  await resetForm();
}

async function resetForm(){
  state.views.question.value = "";
  state.views.response.textContent = await getRandowQuote();

  exibirTextoNaTela('p', await getRandowQuote());
}

async function getRandowQuote(){
  const quotes = [
    "Manda ver meu nobre!",
    "Pode vir com a pergunta!",
    "Estou pronto para responder!",
    "Pode vir quente que estou fervendo!",
    "Aguardo sua pergunta! Vamos lá!",
    "Espero ancioso pela sua pergunta!",
    "Estou começando a ficar entediado! Manda a pergunta!",
    "Tenha vidas a salvar, vá depressa com isso!",
    "Não vai ficar ai o dia todo, vai?",
    "Talvez seja melhor ir jogar Dota...",
    "Ainda to tentando entender como essa giringonça funciona...",
    "Vamos lá, não tenho o dia todo!",
    "Vamos que vamo meu chapa!",
  ];

  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}

async function fetchAskChampions() {
  document.body.style.cursor = "wait";
  const id = state.views.avatar.dataset.id;
  const message = state.views.question.value;

  const response = await apiService.postAskChampion(id, message);
  state.views.response.textContent = response.answer;
  document.body.style.cursor = "default";
  exibirTextoNaTela('p', await response.answer);

}

async function loadCarrousel() {
  const caroujs = (el) => {
    return $("[data-js=" + el + "]");
  };

  caroujs("timeline-carousel").slick({
    infinite: false,
    arrows: true,
    arrows: true,
    prevArrow:
      '<div class="slick-prev"> <div class="btn mr-3 btn-warning d-flex justify-content-center align-items-center"> <div>Anterior</div><svg class="ml-1" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve"> <path d="M10.1,19.1l1.5-1.5L7,13h14.1v-2H7l4.6-4.6l-1.5-1.5L3,12L10.1,19.1z"/> </svg></div></div>',
    nextArrow:
      '<div class="slick-next"> <div class="btn btn-warning d-flex justify-content-center align-items-center"> <svg class="mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M 14 4.9296875 L 12.5 6.4296875 L 17.070312 11 L 3 11 L 3 13 L 17.070312 13 L 12.5 17.570312 L 14 19.070312 L 21.070312 12 L 14 4.9296875 z"/> </svg> <div>Próximo</div></div></div>',
    dots: true,
    autoplay: false,
    speed: 1100,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  });
}

main();

//OK - 1. chanmada pra api do lol
//OK - 2. guardar dados do personagens  
//OK - 3. carregar personagem na tela
//OK - 4. resetar a tela
