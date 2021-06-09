document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('input[name=name]').disabled = true
  document.querySelector('input[name=breed]').disabled = true
  document.querySelector('input[name=sex]').disabled = true
  fetch('http://localhost:3000/dogs')
  .then(resp => resp.json())
  .then(dogs => {
    fetchDogTable(dogs)
    updateDog()
  })
})

function fetchDogTable(dogs) {
  //Create the table
  dogs.forEach(() => document.getElementById('table-body').appendChild(document.createElement('tr')))

  let dogIndex = 0
  for (const tr of document.querySelectorAll('tbody tr')) {
    tr.appendChild(document.createElement('td')).textContent = dogs[dogIndex].name
    tr.appendChild(document.createElement('td')).textContent = dogs[dogIndex].breed
    tr.appendChild(document.createElement('td')).textContent = dogs[dogIndex].sex
    tr.appendChild(document.createElement('td')).appendChild(document.createElement('button')).textContent = 'Edit Dog'
    dogIndex+=1
  }
}

function updateDog() {
  //Send Name, Breed and Sex to the form with a click event listener
  const editDogButtons = document.querySelectorAll('td button')
  let dogId = 1
  let submitId
  for (const button of editDogButtons) {
    button.setAttribute('id',`${dogId}`)
    dogId+=1
    button.addEventListener('click', (e)=> {
      document.querySelector('input[name=name]').disabled = false
    document.querySelector('input[name=breed]').disabled = false
    document.querySelector('input[name=sex]').disabled = false
      document.querySelector('input[name=name]').value = button.parentElement.parentElement.children[0].textContent
      document.querySelector('input[name=breed]').value = button.parentElement.parentElement.children[1].textContent
      document.querySelector('input[name=sex]').value = button.parentElement.parentElement.children[2].textContent
      submitId = button.id
      console.log(submitId)
    }) 
  }
  const form = document.querySelector('#dog-form')
  form.addEventListener('submit', (e)=> {
    // e.preventDefault()
    //Send to the server the dog's new info through a submit event listener
    let formUpdate = {
      name: document.querySelector('input[name=name]').value,
      breed: document.querySelector('input[name=breed]').value,
      sex: document.querySelector('input[name=sex]').value
    }
    let configObj = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(formUpdate)
    }
    console.log(submitId)
    fetch(`http://localhost:3000/dogs/${submitId}`,configObj)
    document.querySelector('input[name=name]').value = ''
    document.querySelector('input[name=breed]').value = ''
    document.querySelector('input[name=sex]').value = ''
    document.getElementById('table-body').innerHTML = ''
    fetch('http://localhost:3000/dogs')
    .then(resp => resp.json())
    .then(dogs => {
      fetchDogTable(dogs)
      updateDog()
    })
  })
}