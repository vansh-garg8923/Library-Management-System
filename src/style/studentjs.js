let logoutbtn = document.querySelector("#logout");

logoutbtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="index.html";
})


let profilebtn = document.querySelector("#myprofile");

profilebtn.addEventListener("click",(event)=>{
    event.preventDefault();

    window.location.href="profile.html";
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
            <th>Shelf_no</th>
            <th>Availability</th>
        </tr>
    ` + data.map(
        book => `
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td>${book.category}</td>
            <td>${book.shelf_no}</td>
            <td>${book.availability}</td>
        </tr>
        `
    ).join("");
});


document.addEventListener("DOMContentLoaded", () => {

    // visible the table
    table.style.visibility="visible";


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
                    <th>Shelf_no</th>
                    <th>Availability</th>
                </tr>
            ` + data.map(
                book => `
                <tr>
                    <td>${book.title}</td>
                    <td>${book.author}</td>
                    <td>${book.isbn}</td>
                    <td>${book.category}</td>
                    <td>${book.shelf_no}</td>
                    <td>${book.availability}</td>
                </tr>
                `
            ).join("");
        });
});
