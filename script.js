const addBtn = document.querySelector('.tambah-buku');
const containerForm = document.querySelector('.input-section .container-inputBook');
const formInp = document.querySelector('.container-inputBook form')
const closeForm = document.querySelector('.container-inputBook form .close-btn');
const inCompleteBook = document.querySelector('#incompleteBookshelfList');
const completeBook = document.querySelector('#completeBookshelfList')
const bookSubmit = document.querySelector('#bookSubmit')
const isComplete = document.querySelector('#inputBookIsComplete')
const contSearch = document.querySelector('.resultSearch')
const darkMode = document.querySelector('#dark-mode')



const dataBookKey = 'DATA_BOOK_KEY'

function showForm() {
    containerForm.classList.add('active')
    formInp.classList.add('active')
}

function closeFormInp() {
    containerForm.classList.remove('active')
    formInp.classList.remove('active')
}

function getDataBook() {
    let data = localStorage.getItem(dataBookKey)
    if (data == null) {
        localStorage.setItem(dataBookKey, JSON.stringify([]));
        return []
    } else {
        return JSON.parse(data)
    }
}

function addBook() {
    const data = getValueForm(
        'inputBookTitle',
        'inputBookAuthor',
        'inputBookYear',
        'inputBookIsComplete'
    )

    const oldBookList = getDataBook()
    oldBookList.push(data)
    saveDataBook(oldBookList)
    closeFormInp()
    renderData(oldBookList)

    return false;
}

function saveDataBook(data) {
    localStorage.setItem(dataBookKey, JSON.stringify(data))
}


function renderData(data) {
    let el = [];

    let isComplete = data.map(d => {
        el.push(`
            <article class="book_item">
                <h3>${d.title}</h3>
                <p>Penulis: ${d.author}</p>
                <p>Tahun: ${d.year} </p>

                <div class="action">
                    <div class="green" data-action="isComplete" data-bookid="${d.id}">${d.isComplete == false ? `<i class="fa-solid fa-circle-check" data-action="isComplete" data-bookid="${d.id}"></i>` : `<i class="fa-solid fa-circle-xmark" data-action="isComplete" data-bookid="${d.id}"></i>`}</div>
                    <div class="orange" data-action="update" data-bookid="${d.id}"><i class="fa-solid fa-pen-to-square" data-action="update" data-bookid="${d.id}"></i></div>
                    <div class="red" data-action="showConfirm" data-bookid="${d.id}"><i class="fa-solid fa-trash-can" data-action="showConfirm" data-bookid="${d.id}"></i></div>
                </div>
            </article>
        `)
        return d.isComplete
    })

    let hasil = [[], []]
    isComplete.forEach((m, i) => {
        let complete = '';
        let inComplete = '';
        if (m == true) {
            complete += el[i]
        } else {
            inComplete += el[i]
        }

        if (complete != '') {
            hasil[0].push(complete)
        } else if (isComplete != '') {
            hasil[1].push(inComplete)
        }

    })

    completeBook.innerHTML = hasil[0].join('')
    inCompleteBook.innerHTML = hasil[1].join('')
}

function getAllparent(el) {
    let a = el;
    let els = [];
    while (a) {
        els.unshift(a);
        a = a.parentNode;
    }
    return els
}

function hideCardBookItem(target) {
    const els = getAllparent(target)
    els[7].classList.add('deleted')
    setTimeout(() => {
        els[7].remove()
    }, 500)

}


function hideConfirm(target) {
    const els = getAllparent(target)
    els[11].remove()
    els[7].classList.add('deleted')
    setTimeout(() => {
        els[7].remove()
    }, 500)
}


function deleteDataBook(target, id) {
    let data = getDataBook();
    data.forEach((m, i) => {
        if (m.id == id) {
            delete data[i]
        }
    })
    const newdData = data.filter(d => d != 'empty')

    saveDataBook(newdData)
    hideConfirm(target)
    setTimeout(() => {
        renderData(newdData)
    }, 200);
}

function getValueForm(title, author, year, isComplete) {
    const objData = new FormData();

    objData.append('title', document.getElementById(title).value)
    objData.append('author', document.getElementById(author).value)
    objData.append('year', document.getElementById(year).value)
    objData.append('isComplete', document.getElementById(isComplete).checked)
    const id = Math.floor(new Date().getTime() / 1000)

    const data = {}
    data.id = id
    for (let [k, v] of objData.entries()) {
        if (k == 'isComplete') {
            v = eval(v)
        }
        data[k] = v
    }
    return data
}

function closeFormUpdate() {
    const container = document.querySelector('.orange .container-inputBook')
    const updateform = document.querySelector('.orange .container-inputBook form')
    container.classList.remove('active')
    updateform.classList.remove('active')
    setTimeout(() => {
        container.remove()
    }, 400)
}

function updateBook(id) {
    const newData = getValueForm(
        'inputBookTitleUpdate',
        'inputBookAuthorUpdate',
        'inputBookYearUpdate',
        'inputBookIsCompleteUpdate')

    const oldBookList = JSON.parse(localStorage.getItem(dataBookKey))
    const newBookList = oldBookList.map(m => {
        if (m.id == id) {
            m.title = newData.title
            m.author = newData.author
            m.year = newData.year
            m.isComplete = newData.isComplete
        }
        return m
    })
    saveDataBook(newBookList)
    closeFormUpdate()
    setTimeout(() => {
        renderData(newBookList)
        searchResultHide()
    }, 300)

    return false
}

function showUpdateForm(target, id) {
    const data = getDataBook();
    let changed = data.filter(m => m.id == id)
    changed = changed[0]
    let el = `
        <div class="container-inputBook">
          <form id="inputBook" autocomplete="off" onsubmit="return updateBook(${id})">
            <h3>Ubah Data Buku</h3>
            <div class="input">
              <label for="inputBookTitleUpdate">Judul</label>
              <input id="inputBookTitleUpdate" value="${changed.title}" type="text" required />
            </div>
            <div class="input">
              <label for="inputBookAuthorUpdate">Penulis</label>
              <input id="inputBookAuthorUpdate" value="${changed.author}" type="text" required />
            </div>
            <div class="input">
              <label for="inputBookYearUpdate">Tahun</label>
              <input id="inputBookYearUpdate" value="${changed.year}" type="number" required />
            </div>
            <div class="input_inline">
              <label for="inputBookIsCompleteUpdate">Selesai dibaca </label>
              <input id="inputBookIsCompleteUpdate" type="checkbox" ${changed.isComplete == true ? 'checked' : ''}/>
            </div>
            <button id="bookSubmit" type="submit">
              Masukkan Buku ke rak <span>Belum selesai dibaca</span>
            </button>
            <span class="close-btn">X</span>
          </form>
        </div>
    `


    target.append(stringToEl(el))
    const containerUpdateForm = target.querySelector('.container-inputBook')
    const updateform = target.querySelector('.container-inputBook form')
    const closeBtn = target.querySelector('.close-btn')
    containerUpdateForm.classList.add('active')
    updateform.classList.add('active')
    closeBtn.addEventListener('click', () => {
        containerUpdateForm.classList.remove('active')
        updateform.classList.remove('active')
    })


}

function handleClickAction(e) {
    let target = e.target
    let idBook = target.dataset.bookid
    let action = target.dataset.action


    if (action == 'showConfirm') {
        showConfirm(target, idBook)
    } else if (action == 'isComplete') {
        updateIsComplete(target, idBook)
    } else if (action == 'delete') {
        deleteDataBook(target, idBook)
    } else if (action == 'closeConfirm') {
        document.querySelector('.dialog-container').remove()
    } else if (action == 'update') {
        showUpdateForm(target, idBook)
    }
}

function updateIsComplete(target, id) {
    let data = getDataBook();
    data.forEach(m => {
        if (m.id == id) {
            if (m.isComplete == true) {
                m.isComplete = false
            } else {
                m.isComplete = true
            }
        }
    })


    saveDataBook(data)
    hideCardBookItem(target)
    setTimeout(() => {
        renderData(data)
    }, 500)
}

function searchResultHide() {
    const result = document.querySelector('.resultSearch')
    result.innerHTML = ''
}

function showConfirm(target, id) {
    let el = `
    <div class="dialog-container">
      <div class="dialog-confirm">
        <p class="close-btn" data-action='closeConfirm'>X</p>
        <h3>Hapus Buku</h3>
        <p>Apakah Anda yakin ?</p>
        <div class="choice">
          <button type="button" data-action='delete' data-bookid='${id}' class="red">Ya</button>
          <button type="button" data-action='closeConfirm' class="green">Tidak</button>
        </div>
      </div>
    </div>
    `
    target.append(stringToEl(el))
}

function searchBook() {
    let input = document.querySelector('#searchBookTitle')

    keyword = input.value
    if (keyword == '' || keyword == ' ') {
        return false
    }

    const data = getDataBook();
    let result = []
    for (let d of data) {
        if (d.title.toLowerCase().includes(keyword.toLowerCase())) {
            result.push(d)
        }
    }

    let el = '<h2>Hasil pencarian</h2><div id="resultSeacrh">'

    if (result == '') {
        let ell = `<h2>Hasil pencarian</h2>
        <div id="resultSeacrh">
        <p style="text-align:center;">'${keyword}' tidak di temukan</p>
        </div>`
        contSearch.innerHTML = ell
        input.value = ""
        return false
    }
    result.forEach(d => {
        el += `
                <article class="book_item">
                    <h3>${d.title}</h3>
                    <p>Penulis: ${d.author}</p>
                    <p>Tahun: ${d.year} </p>
                    <div class="action">
                        <div class="green" data-action="isComplete" data-bookid="${d.id}">${d.isComplete == false ? `<i class="fa-solid fa-circle-check" data-action="isComplete" data-bookid="${d.id}"></i>` : `<i class="fa-solid fa-circle-xmark" data-action="isComplete" data-bookid="${d.id}"></i>`}</div>
                        <div class="orange" data-action="update" data-bookid="${d.id}"><i class="fa-solid fa-pen-to-square" data-action="update" data-bookid="${d.id}"></i></div>
                        <div class="red" data-action="showConfirm" data-bookid="${d.id}"><i class="fa-solid fa-trash-can" data-action="showConfirm" data-bookid="${d.id}"></i></div>
                    </div>
                </article>`
    })
    el += '</div>'
    contSearch.innerHTML = el

    input.value = "";
    return false
}

function reveseIsComplete() {
    if (isComplete.checked == true) {
        bookSubmit.querySelector('span').textContent = 'Selesai di baca'
    } else {
        bookSubmit.querySelector('span').textContent = 'Belum selesai di baca'
    }
}

function stringToEl(string) {
    var parser = new DOMParser(),
        content = 'text/html',
        DOM = parser.parseFromString(string, content);

    return DOM.body.childNodes[0];
}

function runApp() {
    let data = getDataBook();

    renderData(data)

    addBtn.addEventListener('click', showForm)
    closeForm.addEventListener('click', closeFormInp)
    document.addEventListener('click', handleClickAction)
    isComplete.addEventListener('click', reveseIsComplete)
}

if (typeof (localStorage) != 'undefined') {
    runApp()
} else {
    alert('Browser ini tidak mendukung LocalStorage')
}