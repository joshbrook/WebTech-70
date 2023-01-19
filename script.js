async function getForm() {
    let apikey = "5c81b3e9";
    let url = "https://wt.ops.labs.vu.nl/api23/" + apikey;
    let response = await fetch(url);
 
    if (response.ok) {
        let authors = await response.json();
        let html = "<caption><pre><strong>Photo album of famous authors</strong></pre></caption>\
                    <tr>\
                        <th><strong>Image</strong></th>\
                        <th><strong>Author</strong></th>\
                        <th><strong>Alt Text</strong></th>\
                        <th><strong>Tags</strong></th>\
                        <th><strong>Description</strong></th>\
                    </tr>"

        

        for (let entry of authors) {
            html += '<tr>\
                <td><img class="icon" src="' + entry.image + '"></td>\
                <td>' + entry.author + '</td>\
                <td>' + entry.alt + '</td>\
                <td><ul>'
            for (let tag of entry.tags.split(",")) {
                html += '<li>' + tag + '</li>'
            }
            html += '</ul></td>\
                <td>' + entry.description + '</td>\
            </tr>'
        }
        html += '<tr>\
                    <td>\
                        <label for="image">Image URL: </label><br>\
                        <input type="url" id="image" name="image" required>\
                    </td>\
                    <td>\
                        <label for="author">Author Name: </label><br>\
                        <input type="text" id="author" name="author" required>\
                    </td>\
                    <td>\
                        <label for="alt">Alt Text: </label><br>\
                        <input type="text" id="alt" name="alt">\
                    </td>\
                    <td>\
                        <label for="tags">Tags (Comma Separated): </label><br>\
                        <input type="text" id="tags" name="tags">\
                    </td>\
                    <td>\
                        <label for="description">Description: </label><br>\
                        <input type="text" id="description" name="description" required>\
                    </td>\
                </tr>'


        document.getElementById("authors").insertAdjacentHTML("beforeend", html)
    }

    else {
       alert("HTTP error: " + response.status);
    } 
}

async function clearTable(){
    let table = document.getElementById("authors");
    table.innerHTML = "";
}

let addButton = document.getElementById("add");
let searchButton = document.getElementById("search")
addButton.addEventListener("click", clearTable);
addButton.addEventListener("click", getForm);
searchButton.addEventListener("click", clearTable);
searchButton.addEventListener("click", getForm);