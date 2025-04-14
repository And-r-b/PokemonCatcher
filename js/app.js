const throwBtn = document.getElementById('throwBtn');
    const resetBtn = document.getElementById('resetBtn');
    const animationArea = document.getElementById('animationArea');
    const caughtPokemonDiv = document.getElementById('caughtPokemon');
    const collectionDiv = document.getElementById('collection');

    const loadCollection = () => {
      const stored = JSON.parse(localStorage.getItem('caught')) || [];
      collectionDiv.innerHTML = '';
      stored.forEach(pokemon => {
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
    };

    const catchPokemon = async () => {
      const ball = document.createElement('img');
      ball.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
      ball.className = 'pokeball';
      animationArea.appendChild(ball);

      setTimeout(async () => {
        animationArea.innerHTML = '';

        const randomId = Math.floor(Math.random() * 898) + 1; // Gen 1-8 (898 total)
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
        const data = await response.json();

        const pokemon = {
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          image: data.sprites.front_default
        };

        caughtPokemonDiv.innerHTML = `
          <p>You caught a ${pokemon.name}!</p>
          <img src="${pokemon.image}" alt="${pokemon.name}" width="100">
        `;

        const caught = JSON.parse(localStorage.getItem('caught')) || [];
        caught.push(pokemon);
        localStorage.setItem('caught', JSON.stringify(caught));

        loadCollection();
      }, 1200);
    };

    const resetGame = () => {
      localStorage.removeItem('caught');
      collectionDiv.innerHTML = '';
      caughtPokemonDiv.innerHTML = '';
    };

    throwBtn.addEventListener('click', catchPokemon);
    resetBtn.addEventListener('click', resetGame);
    loadCollection();