// users scripts
// get user data from inputs
$("#user-register-btn").on("click", () => {
    let userObj = {
        username: $("#add-user-name").val(),
        email:  $("#add-user-email").val(),
        password:  $("#add-user-password").val()
    };

    $("#add-user-name").val('')
    $("#add-user-email").val('')
    $("#add-user-password").val('')

    createUser(userObj)
})

// add users
function createUser(userObj){
    fetch("http://localhost:3000/users", {
        method: "POST",
        body: JSON.stringify(userObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    });
}

async function isRegisteredCheck(username){
    let res = await fetch('http://localhost:3000/users')
    let data = await res.json()
    let isRegistered = false
    data.forEach((item) => {
        item.username === username ? isRegistered = true : isRegistered = false
    })
    return isRegistered
}
// end users sripts

// reviews scripts
// add review logic
$("#add-review-btn").on("click", async function() {
    let username = $("#add-review-user").val()
    let checkUser = await isRegisteredCheck(username)
    if(!checkUser){
        alert("Please register")
        return
    }
    let reviewObj = {
        image: $("#add-review-image").val(),
        title: $("#add-review-title").val(),
        desc: $("#add-review-desc").val(),
        likeCount: 0,
        user: $("#add-review-user").val()
        
    };

    $("#add-review-image").val('')
    $("#add-review-title").val('')
    $("#add-review-desc").val('')
    $("#add-review-user").val('')

    createReview(reviewObj)
});

async function createReview(reviewObj){
    await fetch("http://localhost:3000/reviews", {
        method: "POST",
        body: JSON.stringify(reviewObj),
        headers: {
            "Content-Type": "application/json;charset=utf-8",
        }
    });
    render()
}

// render func for dynamic content
let page = 1;

async function render(){
    let res = await fetch(`http://localhost:3000/reviews/?_page=${page}&_limit=4`)
    let data = await res.json()
    $('.cards').html('')
    data.forEach(item => {
        $('.cards').append(`<div class="card" style="width: 18rem;" id="${item.id}">
                                <img src="${item.image}"></img>
                                <div class="card-body d-flex flex-column align-items-center">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.desc}</p>
                                    <p>added by: ${item.user}</p>
                                    <p>Likes: ${item.likeCount}</p>
                                    <div class="buttons">
                                    <button class="btn btn-violet" id="like-review">LIKE</button >
                                    <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleAddReviewModal">UPDATE</button >
                                    <button class="btn btn-danger">DELETE</button >
                                     </div>
                                </div>
                            </div>`)
    })

    if(page <= 1){
        $('#previous-btn').css('display', 'none')
    }else($('#previous-btn').css('display', 'block'))

}

// delete review
$('body').on('click', '.btn-danger', function(e){
    let id = e.target.parentNode.parentNode.parentNode.id
    fetch(`http://localhost:3000/reviews/${id}`, {
        method: "DELETE"
    })
        .then(() => render())
})

// update review
// detail review data
async function getDetailData(id){
    let res = await fetch(`http://localhost:3000/reviews/${id}`)
    let data = await res.json()
    return data
}

// update
$('body').on('click', '.btn-success', async function(e){
    let id = e.target.parentNode.parentNode.parentNode.id
    let data = await getDetailData(id)

    $("#add-review-image").val(data.image)
    $("#add-review-title").val(data.title)
    $("#add-review-desc").val(data.desc)
    $("#add-review-user").val(data.user)

    $('.edit-review-btn').attr('id', data.id)

})

$('body').on('click', '.edit-review-btn', async function(e){
    let id = e.target.id
    let data = await getDetailData(id)

    let newReviewObj = {
        image: $("#add-review-image").val(),
        title: $("#add-review-title").val(),
        desc: $("#add-review-desc").val(),
        likeCount: data.likeCount,
        user: $("#add-review-user").val()
    }

    $("#add-review-image").val('')
    $("#add-review-title").val('')
    $("#add-review-desc").val('')
    $("#add-review-user").val('')

    await fetch(`http://localhost:3000/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(newReviewObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
})



// like review
$('body').on('click', '#like-review', async function(e){
    let id = e.target.parentNode.parentNode.parentNode.id
    let data = await getDetailData(id)
    let likedReviewObj = {
        image: data.image,
        title: data.title,
        desc: data.desc,
        likeCount: data.likeCount + 1,
        user: data.user
    }

    await fetch(`http://localhost:3000/reviews/${id}`, {
        method: 'PUT',
        body: JSON.stringify(likedReviewObj),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
})

//search
$('#searchBtn').click(function () {
    let value = $('#searchValue').val();
    let rg = /[a-zA-Z]+/gi;
    let ns = value.match(rg);
    console.log(ns)
    $('.card-title').each(function() {
      let card = $(this).closest('.card');
      let text = $(this).text().toLowerCase();
      let text2 = $(this).text();
      let text3 = $(this).text().toUpperCase();
      
      console.log(text);
     
      text.includes(ns)||text2.includes(ns)||text3.includes(ns)? card.show() : card.hide();
    //   text2.includes(ns)? card.show() : card.hide();
    });
  });  


// pagination
$('#next-btn').on('click', (e) => {
    page++
    render()
})

$('#previous-btn').on('click', (e) => {
    page--
    render()
})

render()
// end reviews scripts


