document.addEventListener("DOMContentLoaded", () => {

    // visible the table
    table.style.visibility="visible";

    // getting pfp of current logged in student
    let student_enroll = localStorage.getItem("curr_user");

    fetch(`/info/student?student_enroll=${encodeURIComponent(student_enroll)}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const container1 = document.querySelector(".profile");
            const img = document.createElement("img");
            img.className = "pfp";
            img.src = data[0].image || "default_profile.png";
            img.alt = "pfp";

            container1.appendChild(img);
        });

    // getting all books data
    fetch("/books")
        .then(res => res.json())
        .then(data => {
            console.log(data);

            const container = document.getElementById("booktable");
            container.innerHTML = `
                <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>ISBN</th>
                    <th>Category</th>
                    <th>Shelf No.</th>
                    <th>Quantity Available</th>
                </tr>
            ` + data.map(
                book => `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.category}</td>
                    <td>${book.shelf_no}</td>
                    <td>${book.quantity}</td>
                </tr>
                `
            ).join("");
        });
});

let logoutbtn = document.querySelector("#logout");

logoutbtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="index.html";
})


let profilebtn = document.querySelector("#myprofile");

profilebtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="student_profile.html";
})

// searching by column
let searchbtn = document.querySelector("#searchbtn");
let table = document.querySelector("table");

searchbtn.addEventListener("click", async (event) => {
    event.preventDefault();

    const column = document.querySelector("#search_by").value;
    const value = document.querySelector("#search").value;
    console.log("Searching column:", column, "value:", value);


    table.style.visibility = "visible";

    const res = await fetch(`/books/search?column=${column}&value=${encodeURIComponent(value)}`);
    const data = await res.json();


    if (!Array.isArray(data)) {
    console.error("Expected array, got:", data);
    return; // stop here if data is not an array
    }

    const container = document.getElementById("booktable");
    container.innerHTML = `
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Shelf No.</th>
            <th>Quantity Available</th>
        </tr>
    ` + data.map(
        book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td>${book.shelf_no}</td>
            <td>${book.quantity}</td>
        </tr>
        `
    ).join("");
});


