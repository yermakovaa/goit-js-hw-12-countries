import './css/main.css';
import countriesApi from './js/fetchCountries';
import countryTpl from './templates/markupCountry.hbs';
import listContriesTpl from './templates/markupListContries.hbs';

import { info, error } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');
let searchedCountry = '';

const refs = {
  input: document.querySelector('.js-search-input'),
  countriesContainer: document.querySelector('.js-countries-container'),
};

refs.input.addEventListener(
  'input',
  debounce(() => {
    onSearch();
  }, 500),
);

function onSearch() {
  clearSearch();
  searchedCountry = refs.input.value;
  countriesApi(searchedCountry).then(markupResult);
}

function clearSearch() {
  refs.countriesContainer.innerHTML = '';
}

function markupResult(countries) {
  if (countries.length > 10) {
    error({
      text: 'To many matches found. Please enter a more specific query!',
    });
    return;
  }
  if (countries.length === 1) {
    clearSearch();
    refs.countriesContainer.insertAdjacentHTML(
      'beforeend',
      countryTpl(countries),
    );
    return;
  }
  if (countries.length <= 10 && countries.length > 1) {
    clearSearch();
    refs.countriesContainer.insertAdjacentHTML(
      'beforeend',
      listContriesTpl(countries),
    );
    return;
  } 
  info({
    text: 'No matches found!',
  });
}