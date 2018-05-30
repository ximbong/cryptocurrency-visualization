document.addEventListener("DOMContentLoaded", function(event) {
  let dataArray = [];
  let index = 100;

  const render = (arr) => {
    let stringHTML = '';
    for (let element of arr) {
      const {
        id,
        name,
        rank,
        quotes: {
          USD: {
            percent_change_1h,
            percent_change_7d,
            percent_change_24h,
            price
          }
        }
      } = element;
      stringHTML += `<div class="coin">
        <div class="coin-name" id="${name}">
          <img src="https://s2.coinmarketcap.com/static/img/coins/16x16/${id}.png" alt=""> ${name}
        </div>
        <div class="rank">
          Rank: <span>${rank}</span>
        </div>
        <div class="price">
          Price: <span>${price}$</span>
        </div>
        <div class="price_change">
          <div class="percentage_change_1h">Change last hour: <span>${percent_change_1h}%</span></div>
          <div class="percentage_change_24h">Change last day: <span>${percent_change_24h}%</span></div>
          <div class="percentage_change_7d">Change last week: <span>${percent_change_7d}%</span></div>
        </div>
      </div>
      `
    }
    document.querySelector(".container").innerHTML += stringHTML;
  }

  const reset = () => {
    document.querySelector(".container").innerHTML = "";
    index = 100;
  }

  const fetchFunction = (url) => {
    fetch(url).then(function(response) {
      return response.json()
    }).then(function(response) {
      dataArray.push.apply(dataArray, response.data)
    })
  }

  const handleSort = (criteria) => {
    if (criteria === 'price') {
      dataArray.sort(function(a, b) {
        return b.quotes.USD.price - a.quotes.USD.price;
      });
    }
    if (criteria === 'name') {
      dataArray.sort(function(a, b) {
        var nameA = a.name.toUpperCase();
        var nameB = b.name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
      });
    }
    if (criteria === 'rank') {
      dataArray.sort(function(a, b) {
        return a.rank - b.rank;
      });
    }
    reset();
    render(dataArray.slice(0, 100))
  }

  const baseUrl = "https://api.coinmarketcap.com/v2/ticker/?limit=100&structure=array&sort=rank";

  for (let i = 0; i < 16; i++) {
    const url = baseUrl + `&start=${i * 100 + 1}`;
    setTimeout(function() {
      fetchFunction(url)
    }, i * 100);
  }

  setTimeout(function() {
    render(dataArray.slice(0, 100))
  }, 1000);

  console.log(dataArray)
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('load-more')) {
      render(dataArray.slice(index, index + 100))
      index += 100;
    }

    if (event.target.classList.contains('sort')) {
      handleSort(event.target.id);
    }
  })

});
