import './css/styles.css';
import debounce from 'lodash.debounce';
const DEBOUNCE_DELAY = 1000;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));

function inputSearch(event) {
  const searchName = event.target.value.trim();

  fetchCountries(searchName).then(countries => {
    if (countries.length === 1) {
      createMarkUpCountryInfo(countries);
    } else if (countries.length >= 2 && countries.length < 10) {
      createMarkUpList(countries);
    } else {
      alert('Too many matches found. Please enter a more specific name.');
    }
  });
}

function fetchCountries(name) {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  });
}

function createMarkUpList(countries) {
  let markUpList = countries
    .map(
      ({ name, flags }) =>
        `<li class="country-list__short-info"><img class="flag" src="${flags.svg}" alt="${name.official}">${name.official}</li> `
    )
    .join('');
  list.insertAdjacentHTML('afterbegin', markUpList);
}

function createMarkUpCountryInfo(countries) {
  let markUp = countries
    .map(({ name, flags, capital, population }) => {
      `<img class="flag" src="${flags.svg}" alt="${name.official}">
        <p class="name">${name.official}</p>
        <p class="capital">Capital: ${capital} </p>
        <p class="population">Population: ${population}</p>
        <p class="languages">languages:${languages} </p>`;
    })
    .join('');
  countryInfo.insertAdjacentHTML('afterbegin', markUp);
}
