const wishlist = btn => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value

    const wishlistAttribute = btn.getAttribute('wishlist')
    let fetchUrl = `/wishlist/${prodId}`

    
    fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'csrf-token': csrf
      }
    })
      .then(result => {
        return result.json()

      })
      .then(data => {
        if(data.message === 'wishAdded'){
          btn.textContent = ' Remove Wishlist'
          btn.className = 'wishlist-button'
        }
        else if(data.message === 'wishRemoved'){
          btn.textContent = 'Add wishlist'
          btn.className = 'wishlist-button'
        }
        
      })
      .catch(err => {
        console.log(err)
      });
  
  };
  

  const reviewAction = elem =>{
    
  }