document.addEventListener('DOMContentLoaded', () => {

  const filterButton = document.querySelector('#good-dog-filter')
  const dogBar = document.querySelector('#dog-bar')
  const dogInfo = document.querySelector('#dog-info')
  let dogs = [];
  let dogToDisplay;

  function fetchData() {
    fetch('http://localhost:3000/pups')
    .then(resp => resp.json())
    .then(data => {
      dogs = data
      renderDogSpan(data)
    })
  }//fetch ends

  fetchData()

  function renderDogSpan(dogs) {
    dogBar.innerHTML = dogs.map(renderDogName).join('')
  }

  function renderDogName(dog) {
    return `<span id='${dog.id}' class='dog'>${dog.name}</span>`
  }

  document.addEventListener('click', (e) => {
    if(e.target.className === 'dog') {
      for(let i = 0; i < dogs.length; i++) {
        if(dogs[i].id === parseInt(e.target.id)) {
          dogToDisplay = dogs[i]
          displayDogInfo(dogToDisplay)
          break;
        }
      }
    } //display dog 'if' ends
    
    else if(e.target.id === 'dog-button') {
      if(e.target.innerText === 'Bad Dog!') {
        e.target.textContent = 'Good Dog!'
        dogToDisplay.isGoodDog = true
        updateDogInfo(dogToDisplay)
      } else {
        e.target.textContent = 'Bad Dog!'
        dogToDisplay.isGoodDog = false
        updateDogInfo(dogToDisplay)
      }
    }//dog good/bad + PATCH ends
    
    else if(e.target.id === 'good-dog-filter') {
      if(filterButton.innerText === 'Filter good dogs: OFF') {
      filterButton.innerText = 'Filter good dogs: ON'
      const goodDogs = dogs.filter(dog => dog.isGoodDog === true)
      renderDogSpan(goodDogs)
      } else {
        filterButton.innerText = 'Filter good dogs: OFF'
        renderDogSpan(dogs)
      }
    } 
  })//click ends

  function updateDogInfo(dogToUpdate) {
    fetch(`http://localhost:3000/pups/${dogToUpdate.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dogToUpdate)
    })//fetch ends
    .then(resp => resp.json())
    .then(data => {
      console.log(data)
    })
  }

  function displayDogInfo(dogToDisplay) {
    let buttonText;
    if(dogToDisplay.isGoodDog === true) {
      buttonText = "Good Dog!"
    } else {
      buttonText = "Bad Dog!"
    }
    dogInfo.innerHTML = `<img src='${dogToDisplay.image}'><h2>${dogToDisplay.name}</h2><button id='dog-button'>${buttonText}</button>`
  }

})