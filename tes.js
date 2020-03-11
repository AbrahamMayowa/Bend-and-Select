<select name="review">
<option value=1 >poor</option>
<option value=2 >good</option>
<option value=3 >very good</option>
<option value=4>exellent</option>
<option value=5>outstanding</option>
</select>


if(elemReviewId == 1){
    for(let nodeElem of parentElem){
        // removed color=yellow from all star icon
        nodeElem.classList.remove('checked')

        //add class checked(color=yellow) to the first star icon
        nodeElem[0].classList.add('checked')

        //set the attribute value to the input value
        formReviewValue.value = elemReviewId  
    }
}


<div class="review-form-wrapper">
<form action="/review/" method="POST">
    <input type="hidden" name="_csrf" id="_csrf" value="<%= csrfToken %>">
    <input type="hidden" name="productId" id="productId" value="<%= productDetails._id %>">
    <input type="hidden" name="reviewValue" id="reviewValue" value="">

    <div class="review-dom-wrapper">
        <span data-review=1 class="fa fa-star" onclick="reviewHandle(this)"></span>
        <span data-review=2 class="fa fa-star" onclick="reviewHandle(this)"></span>
        <span data-review=3 class="fa fa-star" onclick="reviewHandle(this)"></span>
        <span data-review=4 class="fa fa-star" onclick="reviewHandle(this)"></span>
        <span data-review=5 class="fa fa-star" onclick="reviewHandle(this)"></span>
    </div>
    <input class="review-submit" type="submit" value="submit"/>
</form>
</div>

five: 0,
                four: 0,
                three: 0,
                two: 0,
                one: 0