// Variáveis e Seleção de Elementos
const apikey = 'b371b835b1790644cd620a03ae09cd01';
const apiUnsplash = 'https://source.unsplash.com/1600x900/?';

const cityInput = document.querySelector('#city-input');
const searchBtn = document.querySelector('#search');

const cityElement = document.querySelector('#city');
const tempElement = document.querySelector('#temperature span');
const descElement = document.querySelector('#description');
const weatherIconElement = document.querySelector('#weather-icon');
const countryElement = document.querySelector('#country');
const humidityElement = document.querySelector('#humidity span');
const windElement = document.querySelector('#wind span');

const weatherContainer = document.querySelector('#weather-data');

const errorMessageContainer = document.querySelector('#error-message');
const loader = document.querySelector('#loader');

const suggestionButtons = document.querySelectorAll('#suggestions button');

// Loader
const toggleLoader = () => {
  loader.classList.toggle('hide');
};

const getWeatherData = async city => {
  toggleLoader();

  const apiWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}&lang=pt_br`;

  const res = await fetch(apiWeatherURL);
  const data = await res.json();

  toggleLoader();

  return data;
};

// Tratamento de erro
const showErrorMessage = () => {
  errorMessageContainer.classList.remove('hide');
};

const hideInformation = () => {
  errorMessageContainer.classList.add('hide');
  weatherContainer.classList.add('hide');
};

const showWeatherData = async city => {
  hideInformation();

  const data = await getWeatherData(city);

  if (data.cod === '404') {
    showErrorMessage();
    return;
  }

  // Defina a countryCode dentro desta função, usando data.sys.country
  const countryCode = data.sys.country;

  cityElement.innerText = data.name;
  tempElement.innerText = parseInt(data.main.temp);
  descElement.innerText = data.weather[0].description;
  weatherIconElement.setAttribute(
    'src',
    `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`
  );

  fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
    .then(response => response.json())
    .then(countryData => {
      const flagURL = countryData[0].flags.png;
      countryElement.setAttribute('src', flagURL);
    })
    .catch(error => {
      console.error('Erro ao obter dados do país:', error);
    });

  humidityElement.innerText = `${data.main.humidity}%`;
  windElement.innerText = `${data.wind.speed}km/h`;

  // Change bg image
  document.body.style.backgroundImage = `url("${apiUnsplash + city}")`;

  weatherContainer.classList.remove('hide');
};

suggestionButtons.forEach(btn => {
  btn.addEventListener('click', async () => {
    const city = btn.getAttribute('id');

    // Oculta todos os botões de sugestão
    suggestionButtons.forEach(otherBtn => {
      otherBtn.style.display = 'none';
    });

    showWeatherData(city);
  });
});

searchBtn.addEventListener('click', async e => {
  e.preventDefault();

  const city = cityInput.value;

  // Oculta todos os botões de sugestão
  suggestionButtons.forEach(btn => {
    btn.style.display = 'none';
  });

  showWeatherData(city);
});

cityInput.addEventListener('keyup', e => {
  if (e.code === 'Enter') {
    const city = e.target.value;

    // Oculta todos os botões de sugestão
    suggestionButtons.forEach(btn => {
      btn.style.display = 'none';
    });

    showWeatherData(city);
  }
});

// ... (outras partes do código)
