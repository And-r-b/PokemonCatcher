const pokemonList = ["Pikachu", "Charmander", "Bulbasaur", "Squirtle", "Eevee"];

const throwBtn = document.getElementById('throwBtn');
const animationArea = document.getElementById('animationArea');
const caughtPokemonDiv = document.getElementById('caughtPokemon');
const collectionDiv = document.getElementById('collection');

const loadCollection = () => {
  const stored = JSON.parse(localStorage.getItem('caught')) || [];
  collectionDiv.innerHTML = '';
  stored.forEach(pokemon => {
    const div = document.createElement('div');
    div.className = 'pokemon-card';
    div.innerText = pokemon;
    collectionDiv.appendChild(div);
  });
};

const catchPokemon = () => {
  // Throw animation
  const ball = document.createElement('img');
  ball.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  ball.className = 'pokeball';
  animationArea.appendChild(ball);

  setTimeout(() => {
    animationArea.innerHTML = '';
    const pokemon = pokemonList[Math.floor(Math.random() * pokemonList.length)];
    caughtPokemonDiv.innerText = `You caught a ${pokemon}!`;

    // Save to localStorage
    const caught = JSON.parse(localStorage.getItem('caught')) || [];
    caught.push(pokemon);
    localStorage.setItem('caught', JSON.stringify(caught));

    // Update collection
    loadCollection();
  }, 1200);
};

throwBtn.addEventListener('click', catchPokemon);
loadCollection();