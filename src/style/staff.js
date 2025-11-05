let issue_btn = document.querySelector('#issue');

issue_btn.addEventListener('click',async (event)=>{
  event.preventDefault();
  window.location.href = "/staff_issue.html";
});


let logoutbtn = document.querySelector("#logout");

logoutbtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="index.html";
})

let profilebtn = document.querySelector("#myprofile");

profilebtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="staff_profile.html";
})

document.addEventListener("DOMContentLoaded", () => {

    // // visible the table
    // table.style.visibility="visible";

    // // getting pfp of current logged in student
    // let student_enroll = localStorage.getItem("curr_user");

    // fetch(`/info/student?student_enroll=${encodeURIComponent(student_enroll)}`)
    //     .then(res => res.json())
    //     .then(data => {
            // console.log(data);
            const container1 = document.querySelector(".profile");
            const img = document.createElement("img");
            img.className = "pfp";
            img.src = "/public/images/staff/101.jpg";
            img.alt = "pfp";

            container1.appendChild(img);
    //     });

    // // getting all books data
    // fetch("/books")
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data);

    //         const container = document.getElementById("booktable");
    //         container.innerHTML = `
    //             <tr>
    //                 <th>Title</th>
    //                 <th>Author</th>
    //                 <th>ISBN</th>
    //                 <th>Category</th>
    //                 <th>Shelf_no</th>
    //                 <th>Availability</th>
    //             </tr>
    //         ` + data.map(
    //             book => `
    //             <tr>
    //                 <td>${book.title}</td>
    //                 <td>${book.author}</td>
    //                 <td>${book.isbn}</td>
    //                 <td>${book.category}</td>
    //                 <td>${book.shelf_no}</td>
    //                 <td>${book.availability}</td>
    //             </tr>
    //             `
    //         ).join("");
    //     });

});
