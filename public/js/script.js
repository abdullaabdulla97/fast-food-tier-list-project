// (reference for drag and drop: https://medium.com/@prabalrishu123/creating-a-simple-drag-and-drop-functionality-with-javascript-e195d1885ecb)

const RANK = ['S', 'A', 'B', 'C', 'D', 'F'] // created a variable called RANK and assigned it an array to store the ranks (S to F)
let logos = [] // created a variable called logos and assigned it as an empty array to store the logos of the fast food restaurants
let dragging = null // created a variable called dragging and assigned it as null to store the logo that is being currently dragged
let offsetX = 0 // created a variable called offsetX and assigned it as 0 to store position of the logo on the x-axis when it is being dragged
let offsetY = 0 // created a variable called offsetY and assigned it as 0 to store the position of the logo on the y-axis when it is being dragged
let activePointerId = null // store the current pointer id (needed for touch/pointer capture)

function logoRestaurant(restaurant) { // created a function called logoRestaurant with a parameter called restaurant to make a logo for the restaurant
  let image = document.createElement('img') // a new image element is made and stored it in the variable image
  image.src = restaurant.logo // this is the image source 
  image.alt = restaurant.name // this is the image alt text
  image.className = 'logo' // this is the image class namee
  image.setAttribute('data-name', restaurant.name) // this is to store the name of the restaurant in the image element
  image.style.position = 'relative' // the image is set at a relative position (which mean it is relative to the normal position)

  //  ensure mobile dragging works and avoid native image dragging/scrolling
  image.style.touchAction = 'none'         // tells the browser not to handle panning/zooming while we drag
  image.style.userSelect = 'none'          // prevent text selection while dragging
  image.draggable = false                  // disable native HTML5 image drag
  image.addEventListener('dragstart', e => e.preventDefault())

  //  SWITCHED from mouse events to pointer events so it works on mobile too
  image.addEventListener('pointerdown', function(e) { // when a user touches/clicks on the image it will begin the dragging process
    dragging = image // store the image that is dragged in the variable dragging

    // compute the offset within the image based on the pointer location
    const rect = dragging.getBoundingClientRect()
    offsetX = e.clientX - rect.left
    offsetY = e.clientY - rect.top

    activePointerId = e.pointerId
    // capture this pointer so we keep receiving move events even if it leaves the element
    dragging.setPointerCapture(activePointerId)

    // used pointermove/pointerup handlers (mobile + desktop)
    document.addEventListener('pointermove', handleMouseMove, { passive: false })
    document.addEventListener('pointerup', handleMouseUp, { once: true })

    e.preventDefault() // to prevent default behaviour of the image when it is being dragged
  })

  return image // returns the image element containing the logo so that it can be added to the page
}

function handleMouseMove(e) { // this function is created to handle the mouse/pointer movement when image is being dragged
  if (!dragging) { // if it is not being dragged
    return // then returns nothing and exits
  }

  dragging.style.position = 'absolute' // the images is placed at an absolute position

  // place the image under the finger/cursor; clientX/Y are viewport coords, so add scroll offset
  const pageX = e.clientX + window.scrollX
  const pageY = e.clientY + window.scrollY

  dragging.style.left = (pageX - offsetX) + 'px' // for the left position of the image, it will be the x position minus the offsetX
  dragging.style.top  = (pageY - offsetY) + 'px' // for the top position of the image, it will be the y position minus the offsetY
  dragging.style.zIndex = '1000' // the z-index set it to a default value of 1000, so when it is being dragged, it will be on top of the other images
  e.preventDefault() // to prevent page from scrolling while dragging (mobile)
}

function handleMouseUp(e) { // this function is created to handle the mouse/pointer release
  if (!dragging) { // if it is not being dragged
    return // then returns nothing and exits
  } 

  for (let i = 0; i < RANK.length; i++) { // goes through each rank in the RANK array
    let rankDiv = document.getElementById('rank-' + RANK[i]) // the id of the rank div is made by concatenation (rank- and rank name, example: rank-S)
    let rankRect = rankDiv.getBoundingClientRect() // gets the screen position of the rank div and then stores it in the variable rankRect

    if (e.clientX >= rankRect.left && e.clientX <= rankRect.right && e.clientY >= rankRect.top && e.clientY <= rankRect.bottom){ // if the pointer position is inside the rank div
      dragging.style.position = 'static' // the position of the image will be static because it is not being dragged any longer
      dragging.style.zIndex = '' // the z-index will be empty because it is not being dragged any longer
      rankDiv.appendChild(dragging) // append the image to the rank div

      // cleanup listeners/capture
      if (activePointerId !== null) {
        try { 
          dragging.releasePointerCapture(activePointerId) 
        } catch (_) {}
        activePointerId = null // reset the active pointer id
      }
      dragging = null // set it to null because it is not being dragged any longer
      document.removeEventListener('pointermove', handleMouseMove) // remove move handler
      e.preventDefault() // prevent any default behavior
      return // return nothing and then exits
    }
  }

  let list = document.getElementById('logolist') // created a variable called list to store the list of logos 
  let listRect = list.getBoundingClientRect() // gets the screen position of the list and then stores in the variable listRect
  if (e.clientX >= listRect.left && e.clientX <= listRect.right && e.clientY >= listRect.top && e.clientY <= listRect.bottom) { // if the pointer position is inside the list
    dragging.style.position = 'static' // the position of the image will be static because it is not being dragged any longer
    dragging.style.zIndex = '' // the z-index will be empty because it not being dragged any longer
    list.appendChild(dragging) // append the image to the list
  }

  // final cleanup when not dropped on a rank or after list append
  if (activePointerId !== null && dragging) {
    try { 
      dragging.releasePointerCapture(activePointerId) 
    } catch (_) {}
  }
  activePointerId = null // reset the active pointer id
  dragging = null // set it to null because it is not being dragged any longer
  document.removeEventListener('pointermove', handleMouseMove) // remove move handler
  e.preventDefault() // to prevent default behaviour 
}

function showLogos() { // this function is created show the logos of the fast food restaurants 
  fetch('/restaurants') // GET request is made to get the logos of the fast food restaurants from the server using the express route /restaurants
  .then(response => response.json()) // it gets converted to JSON (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
  .then(data => { // it then gets stored in the variable data (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
    const list = document.getElementById('logolist') // the list of logos will then be stored in the variable list
    for (let i = 0; i < data.length; i++) { // goes through each reasturant in the data array
      const image = logoRestaurant(data[i]) // calls the function logoRestaurant to make a draggable logo and stores it in the variable image
      list.appendChild(image) // it then gets added to the logolist
    }
  })
}

// Registration page
function initRegisterPage() { // this function is created to initialize the register page
  const usernameEl   = document.getElementById('username'); // get the username input element
  const passwordEl = document.getElementById('password'); // get the password input element
  const submitBtn  = document.getElementById('submitBtn'); // get the submit button element
  const statusEl   = document.getElementById('status'); // get the status element to show messages to the user

  if (!submitBtn || !usernameEl || !passwordEl || !statusEl) { // if any of the elements are not found
    return; // then return nothing and exits
  }

  submitBtn.addEventListener('click', async () => { // when the submit button is clicked, it will then call this function
    const username = (usernameEl.value || '').trim(); // get the value of the username input element and trim any whitespace
    const password = passwordEl.value || ''; // get the value of the password input element

    function setStatus(el, message, kind) { // this function is created to set the status message to the user
      if (!el) { // if the element is not found
        return; // then return nothing and exits
      }
      el.textContent = message || ''; // set the text content of the element to the message
      el.classList.remove('success', 'error'); // remove any existing classes (success or error)
      if (kind === 'success') { // if the kind is success
        el.classList.add('success'); // then add the class success to the element
      } else if (kind === 'error') { // if the kind is error
        el.classList.add('error'); // then add the class error to the element
      }
    }

    setStatus(statusEl, ''); // clear any existing status message

    if (!username || !password) { // if the username or password is empty
      setStatus(statusEl, 'Please enter a username and password.', 'error'); // then shows this message to the user
      return; // and exits
    }

    try {
      const res = await fetch('/register', { // makes a POST request to the server to register the user using the express route /register
        method: 'POST', // this is a POST request
        headers: { 'Content-Type': 'application/json' }, // the content type is JSON
        body: JSON.stringify({ userid: username, password }) // the body of the request contains the username and password in JSON format
      });
      const ok = res.status === 201; // checks if the response status is 201 (Created)
      const conflict = res.status === 409; // checks if the response status is 409 (Conflict)
      const bad = res.status === 400; // checks if the response status is 400 (Bad Request)

      if (ok) {
        setStatus(statusEl, 'Account created.', 'success'); // if the account is created successfully, then shows this message to the user
      } else if (conflict) {
        setStatus(statusEl, 'That username already exists. Try another.', 'error'); // if the username already exists, then shows this message to the user
      } else if (bad) {
        setStatus(statusEl, 'username and password are required.', 'error'); // if the username or password is empty, then shows this message to the user
      } else {
        setStatus(statusEl, 'Error creating account. Please try again.', 'error'); // for any other errors, then shows this message to the user
      }
    } catch (_) {
      setStatus(statusEl, 'Network error. Please try again.', 'error'); // if there is a network error, then shows this message to the user
    }
  });
}

document.addEventListener('DOMContentLoaded', () => { // when the DOM content is loaded, it will then call this function  
  if (document.getElementById('submitBtn')) { // if the submit button is found
    initRegisterPage(); // then it will call the function initRegisterPage to initialize the register page
  }

  if (document.getElementById('logolist')) { // if the logolist is found
    showLogos(); // then it will call the function showLogos to show the logos of the fast food restaurants
  }
});


