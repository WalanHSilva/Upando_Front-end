import data from "../assets/Webscraping.json" assert { type: "json" };

let loadCount = 21;

let fetchedData = data;

let filters = {
  search: "",
  store: [],
};

const classByStore = {
  Amazon: "container__content__promotions--amazon",
  "Mercado Livre": "container__content__promotions--mercadoLivre",
  Americanas: "container__content__promotions--americanas",
};

function compare(a, b) {
  const firstProductPrice = Number(a.preco_novo.replace(".","").replace(",","."))
  const secondProductPrice = Number(b.preco_novo.replace(".","").replace(",","."))
  if (firstProductPrice < secondProductPrice) {
    return 1;
  }
  if (firstProductPrice > secondProductPrice) {
    return -1;
  }
  return 0;
}

function addFilterByStore(store) {
  if (filters.store.includes(store)) {
    const filterIndex = filters.store.findIndex(
      (filteredStore) => filteredStore === store
    );
    filters.store.splice(filterIndex, 1);
  } else {
    filters.store.push(store);
  }

  fetchData();
}

function byStore(item) {
  if (filters.store.length > 0) {
    const mountedStoreName = item.loja.toLowerCase().replace(" ", "-");
    return filters.store.includes(mountedStoreName);
  }

  return item;
}

function byTitle(item) {
  if (filters.search) {
    return item.titulo.toLowerCase().includes(filters.search);
  }

  return item;
}

function mountCard({
  titulo,
  preco_anterior,
  preco_novo,
  desconto,
  link,
  imagem,
  loja,
}) {
  return `<a class="container__content__promotions ${classByStore[loja]}" href="${link}" target="_blank">
    <img src="${imagem}" alt="${titulo}">
    <div class="container__content__promotions__description">
        <h2>${titulo}</h2>
        <p class="container__content__promotions__description__price">
          <del>R$${preco_anterior}</del>
          <ins>R$${preco_novo} <span>${desconto}</span><img id="icon" src="https://cdn-icons-png.flaticon.com/512/726/726448.png"></ins>
        </p>
    </div>
  </a>`;
}

function fetchData() {
  const listContainer = document.querySelector(".container__content");
  listContainer.innerHTML = "";

  fetchedData
    .filter(byStore)
    .filter(byTitle)
    .sort(compare)
    .slice(0, loadCount)
    .forEach((item, index) => {
      if (index > 0) {
        const card = mountCard(item);
        const cardContainer = document.createElement("div");
        cardContainer.innerHTML = card;
        listContainer.appendChild(cardContainer);
      }
    });
}

function loadMore() {
  loadCount += 21;
  if (fetchedData.length <= loadCount) {
    document
      .querySelector(".container__load-more")
      .classList.add("container__load-more--hidden");
  }
  fetchData();
}

function search(event) {
  event.preventDefault();

  loadCount = 21;
  document
    .querySelector(".container__load-more")
    .classList.remove("container__load-more--hidden");

  filters.search = event.target[0].value.toLowerCase();

  fetchData();
}

window.onload = () => {
  fetchData();

  document
    .querySelector(".container__load-more")
    .addEventListener("click", loadMore);
  document
    .querySelector(".container__search-bar")
    .addEventListener("submit", search);

  document.querySelectorAll("#stores .store-item").forEach((element) => {
    const store = element.getAttribute("data-store");
    element.addEventListener("click", () => addFilterByStore(store));
  });
};

const toTop = document.querySelector(".container__to__top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 100) {
    toTop.classList.add("active");
  } else {
    toTop.classList.remove("active");
  }
});
