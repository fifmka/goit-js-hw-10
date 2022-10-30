import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(inputSearch, DEBOUNCE_DELAY));

function inputSearch(event) {
  const searchName = event.target.value.trim();
  if (searchName === '') {
    list.innerHTML = '';
    countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(searchName)
    .then(countries => {
      if (countries.length === 1) {
        list.innerHTML = '';
        countryInfo.innerHTML = '';
        createMarkUpCountryInfo(countries);
      } else if (countries.length >= 2 && countries.length < 10) {
        list.innerHTML = '';
        countryInfo.innerHTML = '';
        createMarkUpList(countries);
      } else {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createMarkUpList(countries = []) {
  let markUpList = countries
    .map(
      ({ name, flags }) =>
        `<li class="country-list__short-info"><img class="flag" src="${flags.svg}" alt="${name.official}" ><span class="text">${name.official}</span></li> `
    )
    .join('');
  list.insertAdjacentHTML('afterbegin', markUpList);
}

function createMarkUpCountryInfo(countries) {
  let markUp = countries
    .map(
      ({
        name,
        flags,
        capital,
        population,
        languages,
      }) => `<div class="wrap"><img class="big-flag" src="${flags.svg}" alt="${
        name.common
      }"/><p class="name">${name.common}</p></div>
        <p class="capital">Capital: ${capital} </p>
        <p class="population">Population: ${population}</p>
        <p class="languages">languages: ${Object.values(languages)} </p>`
    )
    .join('');
  countryInfo.insertAdjacentHTML('afterbegin', markUp);
}

// function createMarkUpCountryInfo(countries = []) {
//   const { flags, name, capital, population, languages } = countries;
//   let markup = `<img class="flag" src="${flags.svg}" alt="${name.common}">
//         <p class="name">${name.common}</p>
//         <p class="capital">Capital: ${capital} </p>
//         <p class="population">Population: ${population}</p>
//         <p class="languages">languages:${Object.values(languages)} </p>`;
//   countryInfo.insertAdjacentHTML('beforeend', markup);
// }
