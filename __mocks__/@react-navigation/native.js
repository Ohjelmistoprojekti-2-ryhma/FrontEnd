// Tämä mockaus käyttää Reactin omaa useEffectiä, jotta useFocusEffect
// käyttäytyy oikein testeissä ja laukeaa uudelleen riippuvuuksien muuttuessa
// (esim. kun webViewReady muuttuu).

const React = require('react');
const { useEffect } = React;

const useFocusEffect = (callback) => {
  // useFocusEffect on rakennettu useEffectin päälle. Mockaamme sen käyttämään
  // suoraan useEffectiä, jotta se laukeaa uudelleen tilan muuttuessa.
  // Huomaa: Emme anna riippuvuustaulukkoa, jotta se laukeaa aina uudelleen renderöinnin yhteydessä.
  useEffect(() => {
    // Aja callback
    callback();
  }); 
};

// Lisää myös useNavigation, jos sitä käytetään navigointiin
const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  // lisää muut tarvittavat funktiot
});

module.exports = {
  useFocusEffect,
  useNavigation,
};