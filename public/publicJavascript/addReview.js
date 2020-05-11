const reviewHandle = (elem) =>{
  const prodId = document.querySelector('[name=productId]').value
  const csrf = document.querySelector('[name=_csrf]').value

    // select the element of input value that will be sent to backend
    let formReviewValue = elem.parentNode.previousElementSibling

    const elemReviewId = parseInt(elem.dataset.review)

    const parentElem = elem.parentElement.children
    
  
    //convert the nodelist to array to perform Array.prototype.methods
    const nodeConversion = Array.from(parentElem)


    for(let nodeElem of parentElem){
         // removed class(color=yellow) from all star icon
        nodeElem.classList.remove('checked')

        //check the index of the node array
        const childrenIndex = nodeConversion.indexOf(nodeElem)

        //only node up to the clicked start icon will be added with a class 'checked' 
        if(childrenIndex <= elemReviewId-1){

            //add class checked(color=yellow) to the star icon
            nodeElem.classList.add('checked')
            }
            
        }

        //set the attribute value to the input value
        formReviewValue.value = elemReviewId

        const submitBtn = document.querySelector('.review-submit')

        // send the review value to the backend
        const fetchReview = ()=>{
          console.log(formReviewValue.value)
          console.log(prodId)
        fetch('/review', {
          method: 'POST',
          headers: {
            'csrf-token': csrf,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            reviewValue: formReviewValue.value,
            productId: prodId
          })
        })
          .then(result => {
            location.reload()
          })
        }

        submitBtn.addEventListener('click', fetchReview)
    }




const reviewModal = document.querySelector('.review-form-wrapper')
const cancelReview = document.querySelector('.cancel-review')
const openReview = document.querySelector('.review-button')



openReview.addEventListener('click', ()=> reviewModal.style.display = 'flex')

cancelReview.addEventListener('click', ()=> reviewModal.style.display = 'none')

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == reviewModal) {
    reviewModal.style.display = "none";
  }
}