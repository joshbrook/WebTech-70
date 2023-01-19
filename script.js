let apikey = "5c81b3e9";
let url = "https://wt.ops.labs.vu.nl/api23/" + apikey;

async function getData() {
    let response = await fetch(url);

    if (response.ok) {
        let authors = await response.json();
        let html = ""

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

        document.getElementById("formRow").insertAdjacentHTML("beforebegin", html)
        
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

async function resetTable() {
    let response = await fetch(url + "/reset");

    if (response.ok) {
        let authors = await response.json();

        var nodes = document.getElementsByTagName('tr');
        for(var i = 1; i < nodes.length; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }
    
        

    }

    else {
        alert("HTTP error: " + response.status);
    }
}


let form = document.querySelector("form");
form.addEventListener("submit", async function(e) {
    e.preventDefault();
    let response = await fetch("add", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: new FormData(form)
    });
    
    let result = await response.json();
    alert(result);   
});     

