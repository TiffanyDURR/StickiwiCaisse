function mainSearch() {
  searchBar.addEventListener("input", (e) => {
    filteredsongs = data.filter((music) => {
      return replaceApostrophes(music.titre.toLocaleLowerCase()).includes(inputSearchBar) || replaceApostrophes(music.lyrics.toLocaleLowerCase()).includes(inputSearchBar) || replaceApostrophes(music.featuring.toLocaleLowerCase()).includes(inputSearchBar);
    });
    displayCards(filteredsongs);
  });
}
