const siteName = document.getElementById("siteName");
const siteUrl = document.getElementById("siteUrl");
const rowData = document.getElementById("rowData");

const editBtn = document.getElementById("editBtn");
const submitBtn = document.getElementById("submitBtn");
const closeBtn = document.getElementById("closeBtn");

const searchInput = document.getElementById("searchInput");

const popUpCard = document.getElementById("popCard");
const clearBtn = document.getElementById("clearBtn")

let currentIndex = 0;

let bookMarks = [];

// local storage 

if (localStorage.getItem("bookMarksInfoContainer") !== null) {
    bookMarks = JSON.parse(localStorage.getItem('bookMarksInfoContainer'));
    displayData();
}

// get data from user

submitBtn.onclick = function addBookMark() {
    if (siteName.classList.contains('is-valid') &&
        siteUrl.classList.contains('is-valid')) {
        const inputData = {
            bookMark: siteName.value,
            url: siteUrl.value,
        }
        bookMarks.push(inputData);
        localStorage.setItem("bookMarksInfoContainer", JSON.stringify(bookMarks));
        displayData();
        clearForm();
        appendAlert('Great! , You Added a Bookmark!!', 'success')

    } else {
        popUpCard.classList.remove("d-none")
    }
}

// display sites

function displayData() {
    let tableRow = ``;
    for (let i = 0; i < bookMarks.length; i++) {
        tableRow += `
            <tr>
                <td>${i + 1}</td>
                <td>${bookMarks[i].bookMark}</td>

                <td>
                    <a class="btn btn-success" href="${bookMarks[i].url}" target="_blank">
                        <i class="fa-solid fa-eye"></i> Visit 
                    </a>
                </td>

                <td>
                <button onclick="deleteBookMark(${i})"class ="btn btn-danger"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>

                <td>
                <button onclick="updateSiteData(${i})" class="btn btn-dark"><i class="fa-solid fa-recycle"></i> Edit</button>
                </td>
            </tr>    
        `
    }
    rowData.innerHTML = tableRow;

    if (tableRow) {
        clearBtn.classList.remove("d-none")
    } else {
        clearBtn.classList.add("d-none")
    }
}

// Delete sites

function deleteBookMark(index) {
    bookMarks.splice(index, 1);
    localStorage.setItem("bookMarksInfoContainer", JSON.stringify(bookMarks));
    displayData();
    appendAlert('Bookmark has been deleted!', 'danger')
}

// clear inputs after add

function clearForm() {
    siteName.value = null;
    siteUrl.value = null;

    siteUrl.classList.remove("is-valid");
    siteName.classList.remove("is-valid");
}

// update sites

function updateSiteData(index) {
    currentIndex = index;
    siteName.value = bookMarks[index].bookMark,
        siteUrl.value = bookMarks[index].url;

    siteName.classList.add('is-valid')
    siteUrl.classList.add('is-valid')

    submitBtn.classList.add("d-none");
    editBtn.classList.remove("d-none");
}

function confirmEdit() {
    if (siteName.classList.contains('is-valid') &&
        siteUrl.classList.contains('is-valid')) {
        const inputData = {
            bookMark: siteName.value,
            url: siteUrl.value,
        }
        bookMarks.splice(currentIndex, 1, inputData)
        localStorage.setItem("bookMarksInfoContainer", JSON.stringify(bookMarks));
        displayData();
        clearForm();

        submitBtn.classList.remove("d-none");
        editBtn.classList.add("d-none");
        appendAlert('Edited!', 'dark');
    } else {
        submitBtn.onclick = popUpCard.classList.remove("d-none")
    }

}

// search input

function searchUrl() {
    const userInput = searchInput.value;
    let tableRow = "";

    for (let i = 0; i < bookMarks.length; i++) {
        if (bookMarks[i].bookMark.toLowerCase().includes(userInput.toLowerCase())) {
            tableRow += `
            <tr>
                <td>${i + 1}</td>
                <td>${bookMarks[i].bookMark}</td>

                <td>
                    <a class="btn btn-success" href="${bookMarks[i].url}" target="_blank">
                        <i class="fa-solid fa-eye"></i> Visit 
                    </a>
                </td>

                <td>
                <button onclick="deleteBookMark(${i})"class ="btn btn-danger"><i class="fa-solid fa-trash"></i> Delete</button>
                </td>

                <td>
                <button onclick="updateSiteData(${i})" class="btn btn-dark"><i class="fa-solid fa-recycle"></i> Edit</button>
                </td>
            </tr> `
        }
    }
    if (tableRow === "") {
        tableRow += `<td class="lead fs-5 fw-bold pt-2">No Bookmark With Name: ${userInput}</td>`;
    } 

    rowData.innerHTML = tableRow;
}

// Validations (regex)

function validateInputs(inputs) {
    const regex = {
        siteName: /^[\w-\s]{3,}$/,
        siteUrl: /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    };

    if (regex[inputs.id].test(inputs.value) == true) {
        inputs.classList.add("is-valid");
        inputs.classList.remove("is-invalid");
        return true;
    } else {
        inputs.classList.add("is-invalid");
        inputs.classList.remove("is-valid");
        return false;
    }
}

// close popup alert card

function closeCard() {
    popUpCard.classList.add("d-none");
};

closeBtn.addEventListener("click", closeCard);

addEventListener("click", function (e) {
    if (e.target.classList.contains("popup_card")) {
        closeCard();
    }
});

// alert messages

function appendAlert(message, type) {
    const alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);

    setTimeout(() => {
        wrapper.querySelector('.btn-close').click();
    }, 3000);
}

// bootstrap 
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));


// clear table 

clearBtn.onclick = function clearAll() {
    bookMarks.splice(0, bookMarks.length);
    localStorage.setItem("bookMarksInfoContainer", JSON.stringify(bookMarks));
    displayData();
    appendAlert('All Bookmarks are deleted!', 'info');
}
