let apikey = "5c81b3e9";
let url = "https://wt.ops.labs.vu.nl/api23/" + apikey;

// retreives all dat from the webserver and adds it to the table on the webpage
async function getData() {
    let response = await fetch(url);

    if (response.ok) {
        let authors = await response.json();
        let html = "";
        let i = 0;

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
                <td><button class="edit"><img id="b' + i + '" class="ed" src="https://cdn-icons-png.flaticon.com/512/84/84380.png"></button></td>\
                </tr>'
            i++;
        }
        document.getElementById("titleRow").insertAdjacentHTML("afterend", html);   
        createArray();
    }

    else {
       alert("HTTP error: " + response.status);
    } 
}


// empty table of all entries
async function clearTable(){
    var nodes = document.getElementsByTagName('tr');
    for(var i = nodes.length - 2; i >= 1; i--) {
        nodes[i].parentNode.removeChild(nodes[i]);
    }
}

// reset table to default values taken from the webserver
async function resetTable() {
    let response = await fetch(url + "/reset");
    
    if (response.ok) {
        clearTable();
        getData();
    }
}


// form interaction buttons
window.onload=function() {

    // get default values on load
    resetTable();

    // submit new author to table
    let submit = document.getElementById("submit");
    let form = document.getElementById("form");
    submit.addEventListener("click", async function(e) {
        e.preventDefault(e);

        let fd = new FormData(form);
        let newData = {};
        for (var [key, value] of fd.entries()) { 
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
                <td>' + entry.description + '</td>\
                <td><button class="edit"><img id="b' + (authors.length-1) + '" class="ed"\
                    src="https://cdn-icons-png.flaticon.com/512/84/84380.png"></button></td>\
                </tr>'

            document.getElementsByClassName("main")[0].insertAdjacentHTML("beforeend", html)

            let modal2 = document.getElementsByClassName("modal2")[0]
            modal2.style.display = 'none';
        }
        createArray();
    })


    let reset = document.getElementById("reset")
    reset.addEventListener("click", async function(e) {
        resetTable();
    }) 


    let clear = document.getElementById("clear")
    clear.addEventListener("click", async function() {
        clearTable();
    })


    // adding edit buttons through event delegation https://www.mattlunn.me.uk/2012/05/event-delegation-in-javascript/
    setTimeout(() => {
        let table = document.getElementById("authors");
        table.addEventListener("click", async function(e) {
            e.preventDefault();
            if (e.target && e.target.matches("img.ed")) {
                let n = Number(e.target.id.replace("b",""));
                console.log("button " + n + " clicked")

                let response = await fetch(url);
                if (response.ok) {
                    let authors = await response.json()
                    let entry = authors[n]
                    console.log(entry.author)

                    // creating new form for the edit modal
                    newForm = '<h2 id="idno">Update Author ' + (n+1) + '</h2><form id="formEdit"><div><table id="authors">\
                    <tr><td><label for="image">Image URL: </label><br>\
                        <input class="inModal" type="url" id="image" name="image" required value="' + entry.image + '"></td>\
                    <td><label for="author">Author Name: </label><br>\
                        <input class="inModal" type="text" id="author" name="author" required value="' + entry.author + '"></td>\
                    <td><label for="alt">Alt Text: </label><br>\
                        <input class="inModal" type="text" id="alt" name="alt" value="' + entry.alt + '"></td>\
                    <td><label for="tags">Tags: </label><br>\
                        <input class="inModal" type="text" id="tags" name="tags" value="' + entry.tags + '"></td>\
                    <td><label for="description">Description: </label><br>\
                        <textarea class="inModal" style="height:100px" id="description" name="description" required>' + entry.description + '</textarea></td>\
                    </tr></table></div></form><br>\
                    <div><button form="formEdit" type="submit" id="update">Submit</button></div>'
                    
                    //document.getElementById(e.target.id).parentElement.parentElement.parentElement.insertAdjacentHTML("afterend", newForm)

                    renderModal(newForm);
                }

            }

        })
    }, 2000)


    // display edit modal
    let add = document.getElementById("add")
    add.addEventListener("click", async function() {
        let modal2 = document.getElementsByClassName("modal2")[0];
        modal2.style.display = 'block';
        modal2.addEventListener("click", async function(e) {
            if (e.target.className === 'modal2' || e.target.className === "close") {
                modal2.style.display = 'none';
            }
        })
    })
}   


window.onchange = function() {

    // handle edit: find author id and position, replace old data with new data from the form
    let update = document.getElementById("update")
    update.style.display = "inline-block";
    update.addEventListener("click", async function(e) {
        e.preventDefault();
    
        let response = await fetch(url)
        if (response.ok) {
            let authors = await response.json()
            let title = document.getElementById("idno").innerHTML
            let idno = Number(title.replace("Update Author ", ""))
            console.log("id = ", idno)

            newForm = document.getElementById("formEdit")
            let fd = new FormData(newForm);
            let newData = {};
            for (var [key, value] of fd.entries()) { 
                newData[key] = value;
            }

            await fetch(url + "/item/" + authors[(idno-1)].id, {
                method: "PUT",
                body: JSON.stringify(newData),
                headers: {
                    "Content-Type": 'application/json',
                    'Accept': 'application/json'
                 },
            })

            removeModal();

            let res = await fetch(url)
            if (res.ok) {
                let auths = await res.json()
                let entry = auths[(idno-1)]

                html = '<td><img class="icon" src="' + entry.image + '"></td>\
                    <td>' + entry.author + '</td>\
                    <td>' + entry.alt + '</td>\
                    <td><ul class="tags">'
                for (let tag of entry.tags.split(",")) {
                    html += '<li>' + tag + '</li>'
                }
                html += '</ul></td>\
                    <td>' + entry.description + '</td>\
                    <td><button class="edit"><img id="b' + (idno-1) + '" class="ed"\
                        src="https://cdn-icons-png.flaticon.com/512/84/84380.png"></button></td>'

                let row = document.getElementById("b"+(idno-1)).parentElement.parentElement.parentElement;
                console.log(row);
                row.innerHTML = html;

                console.log("Author " + idno + " updated")
            }
        }

        
    })
}


// JS modal creation taken from https://medium.com/@clergemarvin/how-to-create-a-modal-in-javascript-e9ddbff9869c
function renderModal(element){
    // create the background modal div
    const modal = document.createElement('div')
    modal.classList.add('modal')
    // create the inner modal div with appended argument
    const innerDiv = document.createElement('div')
    innerDiv.classList.add('modalContent')
    innerDiv.innerHTML =  '<span class="close">&times;</span>' + element
    // render the modal with child on DOM
    modal.appendChild(innerDiv)
    document.body.appendChild(modal)
    modal.style.display = "block";
    // remove modal if background clicked
    modal.addEventListener('click', event => {
    if (event.target.className === 'modal' || event.target.className === "close") {
      removeModal()
    }
  })
}

// filtering
let selectButton = document.getElementById("selectAuthor");

//idea of creating an array from source: https://medium.com/@jsnidar/using-vanilla-javascript-to-filter-data-returned-in-a-fetch-request-using-dropdown-lists-in-an-html-853651dd5978
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
    select.innerHTML= "<option>Select author</option>";
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
        resetTable();
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
                <td><button class="edit"><img id="b' + (authors.length-1) + '" class="ed"\
                    src="https://cdn-icons-png.flaticon.com/512/84/84380.png"></button></td>\
                </tr>'
            } 
        }
        document.getElementById("titleRow").insertAdjacentHTML("afterend", html)
    }

    else {
       alert("HTTP error: " + response.status);
    } 
};


function removeModal(){
    // find the modal and remove if it exists
    const modal = document.querySelector('.modal')
    if (modal) {
      modal.remove()
    }
}