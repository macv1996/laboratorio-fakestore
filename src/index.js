//Variables
const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const $login = document.querySelector('.login')
const appH1 = document.querySelector('.Main h1')
const pageHome = document.querySelector('#home')
const loginStart = document.querySelector('.login-start')
const loginProfile = document.querySelector('.login-profile')
const buttonImg= document.querySelector('header div img')

//Variables login
const loginForm = document.querySelector('.login-form')

//API
const API = 'https://api.escuelajs.co/api/v1/products';
const APIAUTH = 'https://api.escuelajs.co/api/v1/auth/login';
const APIPROFILE = 'https://api.escuelajs.co/api/v1/auth/profile'
const APICATEGORY = 'https://api.escuelajs.co/api/v1/categories'

//Local Storage
localStorage.setItem('offsetLimit', JSON.stringify({ offset: 0, limit: 10 }))
let offsetLimit = JSON.parse(localStorage.getItem('offsetLimit'));

//Escuchadores Products
window.addEventListener('DOMContentLoaded', navigationPage)
window.addEventListener('hashchange', navigationPage)
//Escuchadores Login
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  getFormLogin()
})
//Escuchadores Header
buttonImg.addEventListener('click',()=>{
  
  const colorBody = document.documentElement.style.getPropertyValue('--primary-color-body')
  
  if (colorBody === '#0d1117') {
    document.documentElement.style.setProperty('--primary-color-body', '#ffffff')
    document.documentElement.style.setProperty('--primary-color-letter', '#3c484e')
    
  } else{

    document.documentElement.style.setProperty('--primary-color-body', '#0d1117')
    document.documentElement.style.setProperty('--primary-color-letter', '#e6edf3')
  }


})

//Instancia Intersection Observer
const intersectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(element => {
    if (element.isIntersecting === true) {
      offsetLimit.offset = offsetLimit.offset + 10
      localStorage.setItem('offsetLimit', JSON.stringify(offsetLimit))
      getData(API, offsetLimit.offset, offsetLimit.limit)
    }
  })
},);


//NAVEGACION
function navigationPage() {

  if (location.hash == '#login') {
    intersectionObserver.disconnect()
    loginPage()
  } else if (location.hash == '#category' && JSON.parse(localStorage.getItem('profile')) ) {
    intersectionObserver.disconnect()
    categoryPage()
  }else if (location.hash == '#products' && JSON.parse(localStorage.getItem('profile'))) {
    productsPage()
  }else if (location.hash == '') {
    intersectionObserver.disconnect()
    homePage()
  }
}

//Funcion para mostrar las paginas
function productsPage() {
  appH1.innerHTML = 'Products'
  $app.innerHTML=''
  pageHome.style.display='none'
  $login.classList.add('inactive')
  $app.classList.remove('inactive')
  getData(API)

}
function loginPage() {
  $login.classList.remove('inactive')
  appH1.innerHTML = 'Login'
  $app.innerHTML=''
  pageHome.style.display='none'
  $app.classList.add('inactive')
  if (JSON.parse(localStorage.getItem('profile'))) {
    loginProfile.classList.remove('inactive')
    loginStart.classList.add('inactive')
    if (loginProfile.innerHTML.trim()== '') {
      printProfile()
    }
  } else{
    loginStart.classList.remove('inactive')
    loginProfile.classList.add('inactive')
  }
  
}
function categoryPage() {
  appH1.innerHTML = 'Categories'
  $app.innerHTML=''
  pageHome.style.display='none'
  $login.classList.add('inactive')
  $app.classList.remove('inactive')
  getDataCategory(APICATEGORY)
}

function homePage() {
  appH1.innerHTML = ''
  $app.innerHTML=''
  pageHome.style.display='grid'
  $login.classList.add('inactive')
  $app.classList.add('inactive')
}


//Funcion obtener datos de la Api
async function getData(API, offset = 0, limit = 10) {
  const res = await fetch(`${API}?offset=${offset}&limit=${limit}`)
  const products = await res.json()
  if (products.length === 0) {
    alert('No hay mas productos para mostrar')
  }
  printData(products)
}

//Funcion para imprimir los datos en el HTML
function printData(products) {
  
  const items = document.createElement('section');
  items.classList.add('Items');
console.log(products);
  products.forEach(product => {
    
    const figureCard = document.createElement('figure')
    const imgCard = document.createElement('img')
    const figCaptionCard = document.createElement('figcaption')
    const h2TitleCard = document.createElement('h2')
    const pCategoryCard = document.createElement('p')
    const pPriceCard = document.createElement('p')
    const spanPriceCard = document.createElement('span')
    const strongPriceCard = document.createElement('strong')

    figureCard.classList.add('Card')
    imgCard.setAttribute('src', 'https://tienda.movistar.com.co/media/catalog/product/cache/ebd1de6550e0d0b8d8c505e2a09b56c4/i/p/iphone15pronegro001_1.jpg')
    h2TitleCard.innerHTML = `${product.title}`
    pCategoryCard.innerHTML = `${product.category.name}`
    strongPriceCard.innerHTML = `$ ${product.price}`
    spanPriceCard.innerHTML = 'Price'


    pPriceCard.appendChild(spanPriceCard)
    pPriceCard.appendChild(strongPriceCard)

    figCaptionCard.appendChild(h2TitleCard)
    figCaptionCard.appendChild(pCategoryCard)
    figCaptionCard.appendChild(pPriceCard)


    figureCard.appendChild(imgCard)
    figureCard.appendChild(figCaptionCard)

    items.appendChild(figureCard)
    $app.appendChild(items)

  });
  intersectionObserver.observe($observe);
}
//fucnion para obeter los datos de la api categoria
async function getDataCategory(API) {
  const res = await fetch(`${API}`)
  const data = await res.json()
  printDataCategory(data)

}

function printDataCategory(categories) {
  const items = document.createElement('section');
  items.classList.add('Items');
  
  categories.forEach(category => {
    
    
    const figureCard = document.createElement('figure')
    const imgCard = document.createElement('img')
    const figCaptionCard = document.createElement('figcaption')
    const h2TitleCard = document.createElement('h2')
    const pIdCard = document.createElement('p')
    

    figureCard.classList.add('Card')
    imgCard.setAttribute('src', 'https://tienda.movistar.com.co/media/catalog/product/cache/ebd1de6550e0d0b8d8c505e2a09b56c4/i/p/iphone15pronegro001_1.jpg')
    h2TitleCard.innerHTML = `Categoria: ${category.name}`
    pIdCard.innerHTML = `Categoria ID: ${category.id}`

    figCaptionCard.appendChild(h2TitleCard)
    figCaptionCard.appendChild(pIdCard)
    
    figureCard.appendChild(imgCard)
    figureCard.appendChild(figCaptionCard)

    items.appendChild(figureCard)
    $app.appendChild(items)

  });
  
}


//Funcion para obtener los datos del formulario
function getFormLogin() {
  const formData = new FormData(loginForm)
  const email = formData.get('email');
  const password = formData.get('password');
  const body = {
    "email": email,
    "password": password
  }
  getAuthLogin(body)
}
//Funcion para obtener el token de la API
async function getAuthLogin(body) {
  const res = await fetch(`${APIAUTH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
  if (res.ok) {
    const data = await res.json();
    const accessToken = data.access_token;
    localStorage.setItem('accessToken',JSON.stringify(accessToken))
    getProfileLogin(accessToken)
  }else{
    alert(`${res.statusText}: Usuario o Contraseña Incorrecta`)
  }
}
//Funcion para  obtener el perfil
async function getProfileLogin(token) {
  const res = await fetch(`${APIPROFILE}`,{
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${token}`
    },
  })
  if (res.ok) {
    const data = await res.json()
    localStorage.setItem('profile',JSON.stringify(data))
    loginStart.classList.add('inactive')
    printProfile()
  }else{
    alert(res.statusText)
  }
  
  
}

function printProfile() {
  loginProfile.classList.remove('inactive')

  const profile = JSON.parse(localStorage.getItem('profile'))
  
  const figure = document.createElement('figure');
  
  const img = document.createElement('img');
  img.src = 'https://th.bing.com/th/id/OIG4.l5VK4k9Rsf.Qt82fw1f7?dpr=3&pid=ImgDetMain';
  img.alt = 'imagen';
  
  const form = document.createElement('form');
  form.classList.add('login-form');
  
  const nameFormGroup = document.createElement('div');
  nameFormGroup.classList.add('login-form--name', 'form-group');
  const nameLabel = document.createElement('label');
  nameLabel.setAttribute('for', 'email');
  nameLabel.textContent = `Email del usuario: ${profile.email}`;
  
  const passwordFormGroup = document.createElement('div');
  passwordFormGroup.classList.add('login-form--contraseña', 'form-group');
  const passwordLabel = document.createElement('label');
  passwordLabel.setAttribute('for', 'password');
  passwordLabel.textContent = 'Contraseña: *****';
  
  const submitButton = document.createElement('button');
  submitButton.textContent = 'Cerrar sesión';
  submitButton.setAttribute('type','submit');

  submitButton.addEventListener('click',()=>{

    localStorage.removeItem('profile')
    localStorage.removeItem('accessToken')
    loginProfile.classList.add('inactive')
    loginProfile.innerHTML=''
    navigationPage()
  })
  
  
  // Añadir elementos al DOM
  nameFormGroup.appendChild(nameLabel);
  passwordFormGroup.appendChild(passwordLabel);
  
  form.appendChild(nameFormGroup);
  form.appendChild(passwordFormGroup);
  form.appendChild(submitButton);
  
  figure.appendChild(img);
  
  loginProfile.appendChild(figure);
  loginProfile.appendChild(form);

}





















