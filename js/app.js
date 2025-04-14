const throwBtn = document.getElementById('throwBtn');
const resetBtn = document.getElementById('resetBtn');
const fullResetBtn = document.getElementById('fullResetBtn');
const animationArea = document.getElementById('animationArea');
const caughtPokemonDiv = document.getElementById('caughtPokemon');
const collectionDiv = document.getElementById('collection');
const trackerDiv = document.getElementById('tracker');
const specialPokemonDiv = document.getElementById('specialPokemonDiv');

const TOTAL_POKEMON = 1025;

const generations = {
  gen1: { start: 1, end: 151 },
  gen2: { start: 152, end: 251 },
  gen3: { start: 252, end: 386 },
  gen4: { start: 387, end: 493 },
  gen5: { start: 494, end: 649 },
  gen6: { start: 650, end: 721 },
  gen7: { start: 722, end: 809 },
  gen8: { start: 810, end: 898 },
  gen9: { start: 899, end: 1025 }
};

const showFinalCongrats = () => {
  const congrats = document.createElement('div');
  congrats.className = 'final-congrats';
  congrats.innerHTML = `
    🎉 <strong>Congratulations!</strong> 🎉<br>
    You've caught <strong>ALL 1025 Pokémon!</strong> You're a true Pokémon Master!
  `;
  document.body.appendChild(congrats);

  // Optional: Auto-hide after a few seconds
  setTimeout(() => {
    congrats.remove();
  }, 8000);
};

const achievementRewards = {
  gen1: {
    name: "Gen 1 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    tooltip: "Caught all Pokémon from Generation 1!"
  },
  gen2: {
    name: "Gen 2 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/250.png",
    tooltip: "Caught all Pokémon from Generation 2!"
  },
  gen3: {
    name: "Gen 3 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/382.png",
    tooltip: "Caught all Pokémon from Generation 3!"
  },
  gen4: {
    name: "Gen 4 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/483.png",
    tooltip: "Caught all Pokémon from Generation 4!"
  },
  gen5: {
    name: "Gen 5 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/643.png",
    tooltip: "Caught all Pokémon from Generation 5!"
  },
  gen6: {
    name: "Gen 6 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/718.png",
    tooltip: "Caught all Pokémon from Generation 6!"
  },
  gen7: {
    name: "Gen 7 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/791.png",
    tooltip: "Caught all Pokémon from Generation 7!"
  },
  gen8: {
    name: "Gen 8 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/898.png",
    tooltip: "Caught all Pokémon from Generation 8!"
  },
  gen9: {
    name: "Gen 9 Master",
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1008.png",
    tooltip: "Caught all Pokémon from Generation 9!"
  }
};

const loadCollection = () => {
  const stored = JSON.parse(localStorage.getItem('caught')) || [];
  collectionDiv.innerHTML = '';
  const unique = stored.reduce((map, p) => {
    map[p.id] = p;
    return map;
  }, {});
  Object.values(unique).forEach(pokemon => {
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

  trackerDiv.innerText = `Caught ${Object.keys(unique).length} / ${TOTAL_POKEMON}`;
  displayGenProgress();
};

const catchPokemon = async () => {
  const ball = document.createElement('img');
  ball.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
  ball.className = 'pokeball';
  animationArea.appendChild(ball);

  setTimeout(async () => {
    animationArea.innerHTML = '';

    const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();

    const pokemon = {
      id: data.id,
      name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
      image: data.sprites.front_default
    };

    const caught = JSON.parse(localStorage.getItem('caught')) || [];
    const alreadyCaught = caught.some(p => p.id === pokemon.id);

    caughtPokemonDiv.innerHTML = `
      <p>You ${alreadyCaught ? 'already have' : 'caught'} a ${pokemon.name}!</p>
      <img src="${pokemon.image}" alt="${pokemon.name}" width="100">
    `;

    if (!alreadyCaught) {
      caught.push(pokemon);
      localStorage.setItem('caught', JSON.stringify(caught));
    }

    loadCollection();
    checkAchievements();
    displayGenProgress();
    setTimeout(() => {
      const cards = document.querySelectorAll('.pokemon-card');
      const lastCard = cards[cards.length - 1];
      if (lastCard) lastCard.classList.add('animate');
    }, 50);

  }, 1200);
};

const resetGame = () => {
  localStorage.removeItem('caught');
  collectionDiv.innerHTML = '';
  caughtPokemonDiv.innerHTML = '';
  loadCollection();
  displayGenProgress();
};

const fullResetGame = () => {
  localStorage.clear();
  resetGame();
  displayAchievements();
  displayGenProgress();
};

const checkAchievements = () => {
  const caught = JSON.parse(localStorage.getItem('caught')) || [];
  const caughtIds = new Set(caught.map(p => p.id));
  const achievements = JSON.parse(localStorage.getItem('achievements')) || {};
  let changed = false;

  for (const [key, gen] of Object.entries(generations)) {
    let completed = true;
    for (let i = gen.start; i <= gen.end; i++) {
      if (!caughtIds.has(i)) {
        completed = false;
        break;
      }
    }
    if (completed && !achievements[key]) {
      achievements[key] = true;
      changed = true;
    }
  }

  if (changed) {
    localStorage.setItem('achievements', JSON.stringify(achievements));
    displayAchievements();
  }
  const totalCaught = caughtIds.size;
  if (totalCaught === TOTAL_POKEMON && !achievements.allCaught) {
    achievements.allCaught = true;
    localStorage.setItem('achievements', JSON.stringify(achievements));
    showFinalCongrats();
  }
};

const displayGenProgress = () => {
  const caught = JSON.parse(localStorage.getItem('caught')) || [];
  const caughtIds = new Set(caught.map(p => p.id));
  const progressDiv = document.getElementById('genProgressList');
  if (!progressDiv) return;

  progressDiv.innerHTML = ''; // Clear before updating

  for (const [key, gen] of Object.entries(generations)) {
    let count = 0;
    for (let i = gen.start; i <= gen.end; i++) {
      if (caughtIds.has(i)) count++;
    }

    const total = gen.end - gen.start + 1;
    const genProgress = document.createElement('div');
    genProgress.textContent = `${key.toUpperCase()}: ${count} / ${total}`;
    progressDiv.appendChild(genProgress);
  }
};

const displayAchievements = () => {
  const achievements = JSON.parse(localStorage.getItem('achievements')) || {};
  specialPokemonDiv.innerHTML = '';

  for (const [key, reward] of Object.entries(achievementRewards)) {
    if (achievements[key]) {
      const card = document.createElement('div');
      card.className = 'pokemon-card';
      card.style.position = 'relative';

      const img = document.createElement('img');
      img.src = reward.image;
      img.alt = reward.name;

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerText = reward.tooltip;
      tooltip.style.position = 'absolute';
      tooltip.style.bottom = '110%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.background = '#333';
      tooltip.style.color = '#fff';
      tooltip.style.padding = '5px 10px';
      tooltip.style.borderRadius = '8px';
      tooltip.style.fontSize = '14px';
      tooltip.style.display = 'none';
      tooltip.style.whiteSpace = 'nowrap';
      tooltip.style.zIndex = '1';

      card.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
      });
      card.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      card.appendChild(img);
      card.appendChild(tooltip);
      specialPokemonDiv.appendChild(card);
    }
  }
};

throwBtn.addEventListener('click', catchPokemon);
resetBtn.addEventListener('click', resetGame);
if (fullResetBtn) fullResetBtn.addEventListener('click', fullResetGame);

loadCollection();
displayAchievements();
