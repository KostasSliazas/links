// jshint esversion:6
(function () {
    const checkboxes = document.getElementById("check-boxes");
    const selection = document.getElementById("select");
    const choise = document.getElementById("choises");
    const createLink = document.getElementById("create-link");
    const outpus = document.getElementById("outpus");
    const closeEx = document.getElementById("exit");
    const closeBtn = document.getElementById("exit1");
    const opensBtn = document.getElementById("open");
    const adition = document.getElementById("aditions");
    const search = document.getElementById("site-search");
    const copyAll = document.getElementById("copy-links");
    const showExport = document.getElementById("export-div");
    const links = document.getElementById("links");
    const found = document.getElementById("founded");
    const docfrag = document.createDocumentFragment();
    const checkeds = document.getElementsByName("check")[0];
    const classSwich = ()=>checkeds.checked ?outpus.classList.add("checks") : outpus.classList.remove("checks");

    checkeds.checked = false;
    checkeds.addEventListener("input", classSwich);

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

    function hide(e) {
        e.style.display = e.style.display === "none" ? "block" : "none";
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
                let key = JSON.stringify(setLinks().full).replace(/['"]+/g, '');
                let data = JSON.stringify(setLinks());
                localStorage.setItem(key, data);
            }
        } else {
            alert("no localStorage in window");
        }
    }

    function extractHostname(url) {
        let hostname;
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
        if (localStorage.length === 0)
            outpus.innerHTML = "No links added...";
        for (let i = 0; i < localStorage.length; i++) {
            let {
                url,
                type,
                full,
                text
            } = JSON.parse(localStorage.getItem(localStorage.key(i)));
            createElem(url, type, text, full);
        }
        outpus.appendChild(docfrag);
        found.innerHTML = localStorage.length;
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
        outpus.appendChild(docfrag);
        if (count === 0) outpus.innerHTML = "No results...";
        found.innerHTML = count;
    }

    function removeThis() {
        // let o = confirm("Are you sure you want to remove?");
        // if (o) {
            localStorage.removeItem(this.firstChild.textContent);
            outpus.innerHTML = "";
            loopLocalStorage();
        // }
        return false;
    }

    function createElem(url, type, text, full) {
        let elems = document.createElement("a");
        let types = document.createElement("span");
        let texts = document.createElement("span");
        let urls = document.createElement("span");
        let close = document.createElement("span");
        close.className = "close";
        close.innerHTML = "×";
        close.onclick = removeThis.bind(elems);
        elems.setAttribute("href", full);
        elems.setAttribute("target", "_blank");
        types.textContent = type;
        urls.textContent = url;
        texts.textContent = text;
        urls.className = "urls";
        elems.appendChild(urls);
        elems.appendChild(texts);
        elems.appendChild(types);
        elems.appendChild(close);
        docfrag.appendChild(elems);
    }

    search.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && event.target.value.length > 2) {
            event.preventDefault();
            loopLocalStorageSearch();
        } else if (event.key === "Backspace" && event.target.value.length === 0) {
            outpus.innerHTML = "";
            found.innerHTML = "";
            loopLocalStorage();
        }
    });

    search.addEventListener("input", (event) => {
        if (event.target.value.length > 2)
            loopLocalStorageSearch();
    });

    copyAll.addEventListener("click", (e) => {
        const data = document.getElementById("export");
        hide(showExport);
        if (data.value.length > 0) {
            return;
        } else
            data.value = "let data = JSON.parse(" + JSON.stringify(JSON.stringify(localStorage)) + ");Object.keys(data).forEach(function (k) {localStorage.setItem(k, data[k]);});";
    });

    // function importLocalStorage(string) {
    //     let data = JSON.parse(string);
    //     Object.keys(data).forEach(function (k) {
    //         localStorage.setItem(k, data[k]);
    //     });
    // }
    createLink.addEventListener("click", () => {
        addStorage();
        outpus.innerHTML = "";
        loopLocalStorage();
    });
    document.addEventListener("click", showCheckboxes);
    closeEx.addEventListener("click", () => hide(showExport));
    closeBtn.addEventListener("click", () => hide(links));
    opensBtn.addEventListener("click", () => hide(links));
    addTextOfChecked();
    loopLocalStorage();
    search.focus();
}());