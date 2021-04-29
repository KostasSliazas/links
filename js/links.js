// all stuf for chekbox
// jshint esversion:6
;
(function () {
  const checkboxes = document.getElementById('check-boxes')
  const selection = document.getElementById('select')
  const choise = document.getElementById('choises')
  const createLink = document.getElementById('create-link')
  const outpus = document.getElementById('outpus')
  const closeEx = document.getElementById('exit')
  const closeBtn = document.getElementById('exit1')
  const opensBtn = document.getElementById('open')
  const adition = document.getElementById('aditions')
  const search = document.getElementById('site-search')
  const copyAll = document.getElementById('copy-links')
  const exportJson = document.getElementById('export-json')
  const showExport = document.getElementById('export-div')
  const links = document.getElementById('links')
  const found = document.getElementById('founded')
  const docfrag = document.createDocumentFragment()
  const checkeds = document.getElementsByName('check')[0]
  const classSwich = () => checkeds.checked ? outpus.classList.add('checks') : outpus.classList.remove('checks')

  checkeds.checked = false
  checkeds.addEventListener('input', classSwich)

  function showCheckboxes (e) {
    if (e.target.id === 'create-link') return
    if (e.target.id === 'select' && !(selection.classList.contains('open'))) {
      selection.classList.add('open')
      checkboxes.style.display = 'block'
    } else {
      if (e.target.tagName === 'LABEL' || e.target.tagName === 'INPUT') return
      selection.classList.remove('open')
      checkboxes.style.display = 'none'
      addTextOfChecked()
    }
  }

  function loopOverInputs () {
    const checked = [];
    [...checkboxes.getElementsByTagName('INPUT')].forEach(e => {
      if (e.checked) checked.push(e.value)
    })
    return checked
  }

  function addTextOfChecked (m) {
    choise.innerHTML = m || loopOverInputs().join(', ')
  }

  function hide (e) {
    e.style.display = e.style.display === 'none' ? 'block' : 'none'
  }

  function setLinks () {
    const url = document.getElementById('urls').value
    if (url.length > 0) {
      const fav = extractHostname(url)
      const createLinkObject = {
        text: adition.value,
        url: fav,
        full: url,
        type: loopOverInputs()
      }
      return createLinkObject
    } else {
      addTextOfChecked('No URL defined')
    }
    return false
  }

  function addStorage () {
    if ('localStorage' in window) {
      if (setLinks()) {
        const key = JSON.stringify(setLinks().full).slice(1, -1)
        const data = JSON.stringify(setLinks())
        window.localStorage.setItem(key, data)
      }
    } else {
      window.alert('no localStorage in window')
    }
  }

  function extractHostname (url) {
    let hostname
    if (url.indexOf('//') > -1) {
      hostname = url.split('/')[2]
    } else {
      hostname = url.split('/')[0]
    }
    hostname = hostname.split(':')[0]
    hostname = hostname.split('?')[0]
    return hostname
  }

  function loopLocalStorage () {
    search.focus()
    search.value = ''
    outpus.innerHTML = ''
    if (window.localStorage.length === 0) {
      outpus.innerHTML = 'No links added...'
      return
    }
    for (let i = 0; i < window.localStorage.length; i++) {
      const {
        url,
        type,
        full,
        text
      } = JSON.parse(window.localStorage.getItem(window.localStorage.key(i)))
      createElem(url, type, text, full)
    }
    outpus.appendChild(docfrag)
    const total = window.localStorage.length
    found.innerHTML = total + '/' + total
  }

  function loopLocalStorageSearch () {
    outpus.innerHTML = ''
    let count = 0
    for (let i = 0, len = window.localStorage.length; i < len; i++) {
      const {
        full,
        text,
        type,
        url
      } = (JSON.parse(window.localStorage.getItem(window.localStorage.key(i))))
      const values = type.concat(text.split(), url.split(), full.split())
      const isInarray = values.map(e => {
        if (e.toLowerCase().includes(search.value.toLowerCase())) {
          return true
        }
        return false
      })
      if (isInarray.includes(true)) {
        count++
        createElem(url, type, text, full)
      }
    }
    outpus.appendChild(docfrag)
    found.innerHTML = count + '/' + window.localStorage.length
    if (count === 0)outpus.innerHTML = 'No results...'
    if (count === 1)outpus.firstElementChild.focus()
  }

  function removeThis () {
    window.localStorage.removeItem(this.href)
    loopLocalStorage()
    return false
  }

  function createElem (url, type, text, full) {
    const elems = document.createElement('a')
    const types = document.createElement('span')
    const texts = document.createElement('span')
    const urls = document.createElement('span')
    const close = document.createElement('span')
    close.className = 'close'
    close.innerHTML = '×'
    close.onclick = removeThis.bind(elems)
    elems.setAttribute('href', full)
    elems.setAttribute('target', '_blank')
    types.textContent = type
    urls.textContent = url
    texts.textContent = text
    urls.className = 'urls'
    elems.appendChild(urls)
    elems.appendChild(texts)
    elems.appendChild(types)
    elems.appendChild(close)
    docfrag.appendChild(elems)
  }

  search.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && event.target.value.length > 0) {
      event.preventDefault()
      loopLocalStorageSearch()
    } else if (event.key === 'Backspace' && event.target.value.length === 0) {
      found.innerHTML = ''
      loopLocalStorage()
    } else return false
  })

  search.addEventListener('input', (event) => {
    if (event.target.value.length >= 0) {
      loopLocalStorageSearch()
    }
  })

  copyAll.addEventListener('click', (e) => {
    hide(showExport)
  })

  const saveData = (function () {
    const a = document.createElement('a')
    return function (data, fileName) {
      const json = JSON.stringify(data, null, 2)
      const blob = new window.Blob([json], {
        type: 'octet/stream'
      })
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = fileName
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }())

  const fileName = `localStorage${dateGet()}.json`

  function dateGet () {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1 // months from 1-12
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()
    return year + '/' + month + '/' + day
  }

  createLink.addEventListener('click', () => {
    addStorage()
    loopLocalStorage()
  })

  function loopStorageItems () {
    const data = []
    for (let i = 0; i < window.localStorage.length; i++) {
      data.push(JSON.parse(window.localStorage.getItem(window.localStorage.key(i))))
      data.join('\r\n')
    }
    return data
  }

  exportJson.addEventListener('click', () => {
    saveData(loopStorageItems(), fileName)
    hide(showExport)
  })
  document.addEventListener('dblclick', loopLocalStorage)
  document.addEventListener('click', showCheckboxes)
  closeEx.addEventListener('click', () => hide(showExport))
  closeBtn.addEventListener('click', () => hide(links))
  opensBtn.addEventListener('click', () => hide(links))
  addTextOfChecked()
  loopLocalStorage()

  function readSingleFile (e) {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    const reader = new window.FileReader()
    reader.onload = function (e) {
      const contents = e.target.result
      displayContents(contents)
    }
    reader.readAsText(file)
  }

  function displayContents (data) {
    const json = JSON.parse(data)
    for (let i = 0; i < json.length; i++) {
      window.localStorage.setItem(json[i].full, JSON.stringify(json[i]))
    }
    hide(showExport)
    loopLocalStorage()
  }

  document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false)
}())
