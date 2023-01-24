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
                <td><ul class="tags">'
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
    let form = document.getElementById("form");
    form.addEventListener("submit", async function(e) {
        e.preventDefault(e);

        let fd = new FormData(form);
        let newData = {};
        for (var [key, value] of fd.entries()) { 
            console.log(key, value);
            newData[key] = value;
        }

        await fetch(url, {
            method: "POST",
            body: JSON.stringify(newData),
            headers: {
                "Content-Type": 'application/json',
                'Accept': 'application/json'
             },
        })


        let response = await fetch(url)
        if (response.ok) {
            let authors = await response.json()
            let entry = authors[authors.length-1]

            html = '<tr>\
                <td><img class="icon" src="' + entry.image + '"></td>\
                <td>' + entry.author + '</td>\
                <td>' + entry.alt + '</td>\
                <td><ul class="tags">'
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

let selectButton = document.getElementById("selectAuthor");
window.addEventListener("load", createArray);
async function createArray(){
    let array = [];

    await fetch(url)
    .then(response => response.json())
    .then(authors => {
        authors.forEach(author => array.push(author))
    })
    console.log(array);
    array = array.map(a => a.author);

    let uniqueArray = [];
    array.forEach((element) => {
        if (!uniqueArray.includes(element)) {
            uniqueArray.push(element);
        }
    });

    /* source: https://stackoverflow.com/questions/9895082/javascript-populate-drop-down-list-with-array */
    let select = document.getElementById("selectAuthor");

    for(var i = 0; i < uniqueArray.length; i++) {
        let item = uniqueArray[i];
        let option = document.createElement("option");
        option.textContent = item;
        option.value = item;
        select.appendChild(option);
    }
}

selectButton.addEventListener("change", filterData);
async function filterData() {
    clearTable();
    let filterName = selectButton.options[selectButton.selectedIndex].text;
    let response = await fetch(url);
    if (filterName === "Select author"){
        resetDefault();
    }
    else if (response.ok) {
        let authors = await response.json();
        let html = ""

        for (let entry of authors) {
            if(entry.author === filterName){
                    html += '<tr>\
                    <td><img class="icon" src="' + entry.image + '"></td>\
                    <td>' + entry.author + '</td>\
                    <td>' + entry.alt + '</td>\
                    <td><ul class="tags">'
                for (let tag of entry.tags.split(",")) {
                    html += '<li>' + tag + '</li>'
                }
                html += '</ul></td>\
                    <td>' + entry.description + '</td>\
                </tr>'
            } 
        }
        document.getElementById("formRow").insertAdjacentHTML("beforebegin", html)
    }

    else {
       alert("HTTP error: " + response.status);
    } 
};


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