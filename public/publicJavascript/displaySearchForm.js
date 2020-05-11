const searchIcon = document.querySelector(".search-icon")
const mobileSearchForm = document.querySelector('.mobile-search-form')
searchIcon.addEventListener("click", ()=> mobileSearchForm.classList.toggle('mobile-form_display'))


const closeIcon = document.querySelector('.close-icon')
closeIcon.addEventListener('click', ()=> mobileSearchForm.classList.remove('mobile-form_display'))