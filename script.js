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
        document.getElementById("authors").insertAdjacentHTML("beforeend", html)
    }

    else {
       alert("HTTP error: " + response.status);
    } 
}