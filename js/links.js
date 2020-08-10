//all stuf for chekbox
// jshint esversion:6
const checkboxes = document.getElementById("check-boxes");
const selection = document.getElementById("select");
const choise = document.getElementById("choises");
const createLink = document.getElementById("create-link");
const outpus = document.getElementById("outpus");
const closeEx = document.getElementsByClassName("close-ex")[0];
const closeBtn = document.getElementsByClassName("close")[0];
const opensBtn = document.getElementById("open");
const adition = document.getElementById("aditions");
const search = document.getElementById("site-search");
const copyAll = document.getElementById("copy-links");
const showExport = document.getElementById("export-div");
const links = document.getElementById("links");

function showCheckboxes(e) {
    addTextOfChecked();
    if (e.target.id === "select" && !(selection.classList.contains("open"))) {
        selection.classList.add("open");
        checkboxes.style.display = "block";
    } else {
        if (e.target.tagName === "LABEL" || e.target.tagName === "INPUT") return;
        selection.classList.remove("open");
        checkboxes.style.display = "none";
    }
}

function loopOverInputs() {
    let checked = [];
    [...checkboxes.getElementsByTagName("INPUT")].forEach(e => {
        if (e.checked) checked.push(e.value);
    });
    return checked;
}

function addTextOfChecked() {
    choise.innerHTML = loopOverInputs().join(", ");
}

function setLinks() {
    const url = document.getElementById("urls").value;
    if (url.length > 2) {
        const fav = extractHostname(url);
        const createLinkObject = {
            text: adition.value,
            url: fav,
            full: url,
            type: loopOverInputs()
        };
        return createLinkObject;
    }
    return false;
}

function addStorage() {
    if ("localStorage" in window) {
        if (setLinks()) {
            var key = setLinks().url;
            var data = JSON.stringify(setLinks());
            localStorage.setItem(key, data);
        }
    } else {
        alert("no localStorage in window");
    }
}

function extractHostname(url) {
    var hostname;
    if (url.indexOf("//") > -1) {
        hostname = url.split('/')[2];
    } else {
        hostname = url.split('/')[0];
    }
    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];
    return hostname;
}

function loopLocalStorage() {
    if (localStorage.length === 0) {
        outpus.innerHTML = "No links added...";
    }
    for (var i = 0; i < localStorage.length; i++) {
        let {
            url,
            type,
            full,
            text
        } = JSON.parse(localStorage.getItem(localStorage.key(i)));
        createElem(url, type, text, full);
    }
}

function hide(elem) {
    if (elem.style.display === "none")
        elem.style.display = "block";
    else
        elem.style.display = "none";
}

function loopLocalStorageSearch() {
    outpus.innerHTML = "";
    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
        let {
            url,
            type,
            full,
            text
        } = JSON.parse(localStorage.getItem(localStorage.key(i)));
        let dats = url;
        type.concat(text.split(), url.split()).forEach(e => {
            if (e.toLowerCase().includes(search.value.toLowerCase()) && dats === url) {
                createElem(url, type, text, full);
                count++;
                dats = "";
            }
        });
    }
    if (count === 0) outpus.innerHTML = "No results... :" + count;
    else document.getElementById("founded").innerHTML = count;
}

function createElem(url, type, text, full) {
    let elems = document.createElement("a");
    let types = document.createElement("span");
    let texts = document.createElement("span");
    let urls = document.createElement("span");
    elems.setAttribute("href", full);
    elems.setAttribute("target", "_blank");
    types.textContent = type;
    urls.textContent = url;
    texts.textContent = text;
    urls.className = "urls";
    elems.appendChild(urls);
    elems.appendChild(texts);
    elems.appendChild(types);
    outpus.appendChild(elems);
}

search.addEventListener("keydown", (e)=> {
    if (event.key === "Enter" && event.target.value.length > 2) {
        event.preventDefault();
        loopLocalStorageSearch();
    } else if (event.key === "Backspace" && event.target.value.length === 0) {
        outpus.innerHTML = "";
        document.getElementById("founded").innerHTML = "";
        loopLocalStorage();
    }
});

search.addEventListener("input", (e) => {
    if (event.target.value.length > 2)
        loopLocalStorageSearch();
});

copyAll.addEventListener("click", (e) => {
    const data = document.getElementById("export");
    hide(showExport);
    if (data.value.length > 0) {
        return;
    } else
        data.value = "var data = JSON.parse(" + JSON.stringify(JSON.stringify(localStorage)) + ");Object.keys(data).forEach(function (k) {localStorage.setItem(k, data[k]);});";
});

// function importLocalStorage(string) {
//     var data = JSON.parse(string);
//     Object.keys(data).forEach(function (k) {
//         localStorage.setItem(k, data[k]);
//     });
// }
createLink.addEventListener("click", () => addStorage(), outpus.innerHTML = "", loopLocalStorage);
document.addEventListener("click", showCheckboxes);
closeEx.addEventListener("click", () => hide(showExport));
closeBtn.addEventListener("click", () => hide(links));
opensBtn.addEventListener("click", () => hide(links));
addTextOfChecked();
loopLocalStorage();
search.focus();