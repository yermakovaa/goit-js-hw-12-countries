import './css/main.css';
import countriesApi from './js/fetchCountries';
import countryTpl from './templates/markupCountry.hbs';
import listContriesTpl from './templates/markupListContries.hbs';

import { info, error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const debounce = require('lodash.debounce');
let searchedCountry = '';

const refs = {
  input: document.querySelector('.js-search-input'),
  countriesContainer: document.querySelector('.js-countries-container'),
};

refs.input.addEventListener('input', debounce(onSearch, 500));

function onSearch() {
  clearSearch();
  searchedCountry = refs.input.value;
  countriesApi(searchedCountry)
    .then(markupResult)
    .catch(err => console.log(err));
}

function clearSearch() {
  refs.countriesContainer.innerHTML = '';
}

function markupResult(countries) {
  if (countries.length === 1) {
    clearSearch();
    markupContries(countryTpl, countries);
  } else if (countries.length > 1 && countries.length <= 10) {
    clearSearch();
    markupContries(listContriesTpl, countries);
  } else if (countries.length > 10) {
    outputInfo(
      error,
      'To many matches found. Please enter a more specific query!',
    );
  } else {
    outputInfo(info, 'No matches found!');
  }
}

function outputInfo(typeInfo, text) {
  typeInfo({
    text: `${text}`,
    delay: 1400,
    closerHover: true,
  });
}

function markupContries(tpl, countries) {
  refs.countriesContainer.insertAdjacentHTML('beforeend', tpl(countries));
}
