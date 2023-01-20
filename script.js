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
    var nodes = document.getElementsByTagName('tr');
    for(var i = nodes.length - 2; i >= 1; i--) {
        nodes[i].parentNode.removeChild(nodes[i]);
    }
}

window.onload=function() {
    let form = document.querySelector("form");
    form.addEventListener("submit", async function(e) {
        e.preventDefault(e);

        await fetch(url, {
            method: "POST",
            body: new FormData(form)
        });

        let response = await fetch(url)
        if (response.ok) {
            let authors = await response.json()
            let entry = authors[authors.length-1]

            html = '<tr>\
                <td><img class="icon" src="' + entry.image + '"></td>\
                <td>' + entry.author + '</td>\
                <td>' + entry.alt + '</td>\
                <td><ul>'
            for (let tag of entry.tags.split(",")) {
                html += '<li>' + tag + '</li>'
            }
            html += '</ul></td>\
                <td>' + entry.description + '</td></tr>'

            document.getElementById("formRow").insertAdjacentHTML("beforebegin", html)
        }
    }); 
}

async function resetDefault() {
    let response = await fetch(url + "/reset");

    if (response.ok) {
        clearTable();
        getData();
    }
}

let form = document.querySelector("form")
async function sendForm(e) {
    e.preventDefault();
    await fetch(url, {
        method: "POST",
        body: new FormData(form)
    });

    let response = await fetch(url)
    if (response.ok) {
        let authors = await response.json()
        let entry = authors[authors.length]

        html = '<tr>\
            <td><img class="icon" src="' + entry.image + '"></td>\
            <td>' + entry.author + '</td>\
            <td>' + entry.alt + '</td>\
            <td><ul>'
        for (let tag of entry.tags.split(",")) {
            html += '<li>' + tag + '</li>'
        }
        html += '</ul></td>\
            <td>' + entry.description + '</td></tr>'

        document.getElementById("formRow").insertAdjacentHTML("beforebegin", html)
    }
}

// Modal javascript from source: https://www.w3schools.com/howto/howto_css_modals.asp
var modal = document.getElementById("modalDiv");
var modalButton = document.getElementById("modalButton");
var span = document.getElementsByClassName("close")[0];

modalButton.addEventListener("click", displayModal);
span.addEventListener("click", hideModal);

async function displayModal() {
  modal.style.display = "block";
  console.log("its working")
}

async function hideModal() {
  modal.style.display = "none";
  console.log("its working")
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    console.log("its working")
  }
}