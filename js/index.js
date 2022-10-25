import data from '../assets/Mercado_Livre.json' assert {type: 'json'};

let loadCount = 21;

let fetchedData = data

function mountCard ({title, oldPrice, newPrice, discount, link}) {
    return `<a class="container__content__promotions" href="${link}" target="_blank">
    <img src="/assets/img/Matheus.jpeg" alt="${title}">
    <div class="container__content__promotions__description">
        <h2>${title}</h2>
        <p class="container__content__promotions__description__price">
          <del>${oldPrice}</del>
          <ins>${newPrice} <span>${discount}</span></ins>
        </p>
    </div>
  </a>`
}

function fetchData () {
    const listContainer = document.querySelector(".container__content")
    listContainer.innerHTML = ""

    fetchedData.slice(0, loadCount).forEach((item, index) => {
       if (index > 0) {
        const card = mountCard(item)
        const cardContainer = document.createElement("div");
        cardContainer.innerHTML = card
        listContainer.appendChild(cardContainer)
       }
    })
}

function loadMore () {
    loadCount += 21
    if (fetchedData.length <= loadCount) {
        document.querySelector(".container__load-more").classList.add("container__load-more--hidden")
    }
    fetchData()
}

function search (event) {
    event.preventDefault();

    loadCount = 21
    document.querySelector(".container__load-more").classList.remove("container__load-more--hidden")
    
    fetchedData = data.filter(item => item.title.toLowerCase().includes(event.target[0].value.toLowerCase()))
    fetchData()
}

window.onload = () => {
    fetchData()

    document.querySelector(".container__load-more").addEventListener("click", loadMore)
    document.querySelector(".container__search-bar").addEventListener("submit", search)
}