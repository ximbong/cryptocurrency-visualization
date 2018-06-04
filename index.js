document.addEventListener("DOMContentLoaded", function(event) {
  let dataArray = [];
  const time_array = ["hour", "day", "week"];
  let index = 100; //index means the number of the elements on the page
  const baseUrl = "https://api.coinmarketcap.com/v2/ticker/?limit=100&structure=array&sort=rank";

  //render elements from an array
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
      `
      const percentage_array = [percent_change_1h, percent_change_24h, percent_change_7d];
      percentage_array.forEach(function(element, index) {
        if (!element) {
          stringHTML += `
              <div class="${Object.keys({element})[0]}">
                Change last ${time_array[index]}: <span>unknown</i></span>
              </div>
          `;
        } else if (element > 0) {
          stringHTML += `
              <div class="${Object.keys({element})[0]}">
                Change last ${time_array[index]}: <span class="increase">${element}% <i class="fas fa-caret-up"></i></span>
              </div>
          `;
          } else {
            stringHTML += `
              <div class="${Object.keys({element})[0]}">
                Change last ${time_array[index]}: <span class="decrease">${element}% <i class="fas fa-caret-down"></i></span>
              </div>
          `;
            }});
          stringHTML += `</div></div>`
        };

        document.querySelector(".container").innerHTML += stringHTML;
      }

      //empty the div, set index to 100 (basic)
      const reset = () => {
        document.querySelector(".container").innerHTML = "";
        index = 100;
      }

      //fetch data from an url, and push into dataArray
      const fetchFunction = (url) => {
        fetch(url).then(function(response) {
          return response.json()
        }).then(function(response) {
          dataArray.push(...response.data)
        })
      }

      //sort with different criteria
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
        document.querySelector('input').value = "";
      }

      //fetch first 100 coins when page loads
      fetch(baseUrl).then(function(response) {
        return response.json()
      }).then(function(response) {
        dataArray.push(...response.data)
        render(dataArray)
      }).then(function(response) { //fetch the rest when page finish rendering
        for (let i = 1; i < 16; i++) {
          const url = baseUrl + `&start=${i * 100 + 1}`;
          setTimeout(function() {
            fetchFunction(url)
          }, i * 100);
        }
      })

      document.addEventListener('click', function(event) {

        //if click on the load-more button
        if (event.target.classList.contains('load-more')) {
          render(dataArray.slice(index, index + 100))
          index += 100;
        }

        //the target id has the same name with criteria name in handleSort declaration
        if (event.target.classList.contains('sort')) {
          handleSort(event.target.id);
        }
      });

      document.querySelector('input').addEventListener('keyup', function(event) {
        let value = this.value;
        if (value !== "") { //if value is not empty
          let filterArray = dataArray.filter(function(element) {
            return element.name.toLowerCase().includes(value.toLowerCase())
          })
          reset();
          render(filterArray);
          document.querySelector('.load-more').style.display = 'none';
        } else { //if value is empty
          reset();
          render(dataArray.slice(0, 100))
          document.querySelector('.load-more').style.display = 'flex';
        }
      })
    });
