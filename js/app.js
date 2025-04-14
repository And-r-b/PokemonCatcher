const throwBtn = document.getElementById('throwBtn');
const resetBtn = document.getElementById('resetBtn');
const animationArea = document.getElementById('animationArea');
const caughtPokemonDiv = document.getElementById('caughtPokemon');
const collectionDiv = document.getElementById('collection');
const trackerDiv = document.getElementById('tracker'); // New tracker display area

const loadCollection = () => {
  const stored = JSON.parse(localStorage.getItem('caught')) || [];
  const specialPokemon = JSON.parse(localStorage.getItem('specialPokemon')) || null; // Get special Pokémon

  collectionDiv.innerHTML = ''; // Clear regular collection

  // If the special Pokémon exists, display it in the dedicated section
  if (specialPokemon) {
    displaySpecialPokemon(specialPokemon);
  }

  // Load regular caught Pokémon
  stored.forEach((pokemon) => {
    const div = document.createElement('div');
    div.className = 'pokemon-card';

    const img = document.createElement('img');
    img.src = pokemon.image;
    img.alt = pokemon.name;

    const name = document.createElement('div');
    name.innerText = pokemon.name;

    div.appendChild(img);
    div.appendChild(name);
    collectionDiv.appendChild(div);
  });

  // Update tracker information
  updateTracker(stored);
};

const updateTracker = (caughtPokemons) => {
  const totalPokemon = 1025;  // Total number of Pokémon in the Pokédex (Gen 1-9)
  const caughtCount = caughtPokemons.length;
  const remainingCount = totalPokemon - caughtCount;

  // Display how many Pokémon are caught and how many are left to catch
  trackerDiv.innerHTML = `
    <p>You have caught ${caughtCount} Pokémon!</p>
    <p>You have ${remainingCount} Pokémon left to catch!</p>
  `;
};

const checkForCompletion = (caughtPokemons) => {
  const totalPokemon = 1025;
  if (caughtPokemons.length === totalPokemon) {
    // Show celebration message
    celebrateCompletion();

    // Give a reward for catching all Pokémon
    giveReward();
  }
};

const celebrateCompletion = () => {
  caughtPokemonDiv.innerHTML = `
    <p>Congratulations! You've caught all ${1025} Pokémon!</p>
    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png" alt="Master Ball" width="100">
    <p>You're a true Pokémon Master!</p>
  `;
};

const displaySpecialPokemon = (specialPokemon) => {
  const specialPokemonDiv = document.getElementById('specialPokemonDiv');
  specialPokemonDiv.innerHTML = `
    <div class="pokemon-card" id="specialPokemonCard">
      <img src="${specialPokemon.image}" alt="${specialPokemon.name}" width="100">
      <div>${specialPokemon.name}</div>
      <div class="tooltip">
        <p><strong>Pokémon Master!</strong></p>
        <p>Managed to catch all the Pokémon once!</p>
      </div>
    </div>
  `;
};


const giveReward = () => {
  const specialPokemon = {
    name: "Mew",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/151.png"
  };

  // Store the special Pokémon in local storage
  localStorage.setItem('specialPokemon', JSON.stringify(specialPokemon));

  // Display the special Pokémon in the separate section
  displaySpecialPokemon(specialPokemon);

  caughtPokemonDiv.innerHTML += `
    <p>As a reward for catching all 1025 Pokémon, you receive a special Pokémon: ${specialPokemon.name}!</p>
    <img src="${specialPokemon.image}" alt="${specialPokemon.name}" width="100">
  `;
};

// Modify catchPokemon to check for completion
const catchPokemon = async () => {
  const ball = document.createElement('img');
  ball.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  ball.className = 'pokeball';
  animationArea.appendChild(ball);

  setTimeout(async () => {
    animationArea.innerHTML = '';

    const randomId = Math.floor(Math.random() * 1025) + 1; // Gen 1-1025
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();

    const pokemon = {
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.front_default
    };

    const caught = JSON.parse(localStorage.getItem('caught')) || [];
    
    // Check for duplicates
    if (caught.some(existingPokemon => existingPokemon.name === pokemon.name)) {
      caughtPokemonDiv.innerHTML = `
        <p>You already caught a ${pokemon.name}!</p>
      `;
    } else {
      caught.push(pokemon);
      localStorage.setItem('caught', JSON.stringify(caught));
      caughtPokemonDiv.innerHTML = `
        <p>You caught a ${pokemon.name}!</p>
        <img src="${pokemon.image}" alt="${pokemon.name}" width="100">
      `;
    }

    loadCollection();

    // Check for completion
    checkForCompletion(caught);

    // Animate the last added card
    setTimeout(() => {
      const cards = document.querySelectorAll('.pokemon-card');
      const lastCard = cards[cards.length - 1];
      lastCard.classList.add('animate');
    }, 50);

  }, 1200);
};

const resetGame = () => {
  // Save special Pokémon before clearing other caught data
  const specialPokemon = localStorage.getItem('specialPokemon');
  
  // Clear caught Pokémon data
  localStorage.removeItem('caught');
  
  // Restore the special Pokémon after reset
  if (specialPokemon) {
    localStorage.setItem('specialPokemon', specialPokemon);
  }

  collectionDiv.innerHTML = ''; // Clear regular Pokémon collection
  caughtPokemonDiv.innerHTML = ''; // Clear message area
  trackerDiv.innerHTML = ''; // Reset tracker display
  loadCollection(); // Re-load collections including the special Pokémon
};

const fullResetGame = () => {
  localStorage.removeItem('caught');
  localStorage.removeItem('specialPokemon');

  collectionDiv.innerHTML = '';
  caughtPokemonDiv.innerHTML = '';
  document.getElementById('specialPokemonDiv').innerHTML = '';
};

document.getElementById('fullResetBtn').addEventListener('click', fullResetGame);


throwBtn.addEventListener('click', catchPokemon);
resetBtn.addEventListener('click', resetGame);
loadCollection();
