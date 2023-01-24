/*
if(document.querySelector(".form-cadastro")){
    const form = document.querySelector(".form-cadastro");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
}
*/

if(document.querySelector(".form-cadastro")){
    const regexNumbers = /[0-9]/;
    const alphabet = /[A-z-\s]/;
    const redColor = "#ffd2d2";


    /* CHECK CPF INPUT */
    const inputCPF = document.querySelector("#cpf");

    inputCPF.addEventListener("keypress", (e) => {
        if(e.target.value.length == 3){
            e.target.value += ".";
        }

        if(e.target.value.length == 7){
            e.target.value += ".";
        }

        if(e.target.value.length == 11){
            e.target.value += "-";
        }

        if(e.target.value.length == 14){
            e.preventDefault();
        }

        if(!regexNumbers.test(e.key)){
            e.target.style.backgroundColor = redColor;
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }

    })

    inputCPF.addEventListener("change", (e) => {
        if(e.target.value.length != 14){
            if(e.target.value.length == 11){
                const array = e.target.value.split("");
                array.splice(3, 0, ".");
                array.splice(7, 0, ".");
                array.splice(11, 0, "-");
                e.target.value = array.join("");
            }
        }
    })

    inputCPF.addEventListener('focusout', (e) =>{
        if(regexNumbers.test(e.target.value) || e.target.value == ''){
            e.target.style.backgroundColor = "transparent";
        }
    })

    inputCPF.addEventListener("keyup", (e) => {
        if(e.key.match("Backspace")){
            e.target.style.backgroundColor = "transparent";
        }
    })



    /* CHECK MATRICULA INPUT */
    if(document.querySelector("#matricula")){
        document.querySelector("#matricula")
        .addEventListener("keypress", (e) => {
    
            if(e.target.value.length == 15){
                e.preventDefault();
            }
            
            if(!regexNumbers.test(e.key)){
                e.preventDefault();
            }
        })
    }





    /* CHECK NOME INPUT */
    const nomeInput = document.querySelector("#nome");

    nomeInput.addEventListener("keypress", (e) => {

        if(e.target.value.length == 60){
            e.preventDefault();
        }

        if(!alphabet.test(e.key)){
            e.target.style.backgroundColor = redColor;
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }
    })

    nomeInput.addEventListener("focusout", (e) => {
        if(alphabet.test(e.target.value) || e.target.value == ''){
            e.target.style.backgroundColor = "transparent";
        }
    })

    nomeInput.addEventListener("keyup", (e) => {
        if(e.key.match("Backspace")){
            e.target.style.backgroundColor = "transparent";
        }
    })




    /* CHECK ORGÃO EMISSOR INPUT */
    const orgaoEmissor = document.querySelector("#orgao-emissor");

    orgaoEmissor.addEventListener("keypress", (e) => {
        if(e.target.value.length == 7){
            e.preventDefault();
        }

        if(!alphabet.test(e.key)){
            e.target.style.backgroundColor = redColor;
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }
    })

    orgaoEmissor.addEventListener("focusout", (e) => {
        if(alphabet.test(e.target.value) || e.target.value == ''){
            e.target.style.backgroundColor = "transparent";
        }
    })

    document.querySelector("#identidade")
    .addEventListener("keypress", (e) => {
        if(e.target.value.length == 10){
            e.preventDefault();
        }
    })




    // NUMERO DE ENDEREÇO
    const addressNumber = document.querySelector("#numero");

    addressNumber.addEventListener("keypress", (e) => {

        if(!regexNumbers.test(e.key)){
            e.target.style.backgroundColor = redColor;
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }       

    })

    addressNumber.addEventListener("keyup", (e) => {
        if(e.key.match("Backspace")){
            e.target.style.backgroundColor = "transparent";
        }
    })

    addressNumber.addEventListener("focusout", (e) => {
        if(regexNumbers.test(e.target.value) || e.target.value == ''){
            e.target.style.backgroundColor = "transparent";
        }
    })


    // CIDADE INPUT
    const city = document.querySelector("#cidade");

    city.addEventListener("keypress", (e) => {

        if(e.target.value.length == 30){
            e.preventDefault();
        }

        if(!alphabet.test(e.key)){
            e.target.style.backgroundColor = redColor;
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }
    })

    city.addEventListener("focusout", (e) => {
        if(alphabet.test(e.target.value) || e.target.value == ''){
            e.target.style.backgroundColor = "transparent";
        }
    })


    // ENDEREÇO INPUT
    document.querySelector("#endereco")
    .addEventListener("keypress", (e) => {
        if(e.target.value.length == 50){
            e.preventDefault();
        }
    })

    const sus = document.querySelector("#cartao-sus");

    sus.addEventListener("keypress", (e) => {
        if(e.target.value.length == 15){
            e.preventDefault();
        }

        if(!regexNumbers.test(e.key)){
            e.target.style.backgroundColor = redColor;
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }
    })

    sus.addEventListener("focusout", (e) => {
        if(regexNumbers.test(e.target.value) || e.target.value == ""){
            e.target.style.backgroundColor = "transparent";
        }
    })




}





// PAGINATION


if(document.querySelector(".table-body")){
    const INDEX = 4;

    const pagination = {
        paginatedList: document.querySelector('#paginated-list'),
        listItems: document.querySelectorAll(".table-row"),
        paginationNumbers: document.querySelector("#pagination-numbers"),
        prevBtn: document.querySelector("#prev-button"),
        nextBtn: document.querySelector("#next-button"),
        paginationNumber: undefined,
        paginationLimit: INDEX,
        pageCount: Math.ceil(document.querySelectorAll(".table-row").length / INDEX),
        currentPage: 1
    }

    getPageNumbers(pagination);
    setCurrentPage(pagination.currentPage, pagination);
    addListeners(pagination);
};


function addListeners(pagination){
    pagination.paginationNumber.forEach((button) => {
        const pageIndex = Number(button.getAttribute("page-index"));

        if(pageIndex){
            button.addEventListener("click", () => {
              setCurrentPage(pageIndex, pagination);
            });
        };
    });

    pagination.prevBtn.addEventListener("click", () => {
        setCurrentPage(pagination.currentPage--, pagination);
    });
    
    pagination.nextBtn.addEventListener("click", () => {
        setCurrentPage(pagination.currentPage++, pagination);
    });
};

// ENABLE AND DISABLE NEXT AND PREVIOUS BUTTONS
function setConditionalForButtons(pagination){
    if(pagination.currentPage == 1){
        pagination.prevBtn.setAttribute("disabled", true);
    } else{
        pagination.prevBtn.setAttribute("disabled", false);
    }

    if(pagination.pageCount == pagination.currentPage){
        pagination.prevBtn.setAttribute("disabled", true);
    } else{
        pagination.nextBtn.setAttribute("disabled", false);
    }
}


function setActivePageNumber(pagination){
    pagination.paginationNumber.forEach((button) => {
        button.classList.remove("active");

        const pageIndex = Number(button.getAttribute("page-index"));
        if(pageIndex == pagination.currentPage){
            button.classList.add("active");
        };
    });
};

function setCurrentPage(pageNum, pagination){
    pagination.currentPage = pageNum;

    setConditionalForButtons(pagination);
    setActivePageNumber(pagination);

    const prevRange = (pageNum - 1) * pagination.paginationLimit;
    const currRange = pageNum * pagination.paginationLimit;

    pagination.listItems.forEach((item, index) => {
        item.classList.add("hidden");

        if(index >= prevRange && index < currRange){
            item.classList.remove("hidden");
        };
    });
};

// ADD BUTTONS TO PAGINATION-NUMBERS BOX
function getPageNumbers(pagination){
    for(let i = 1; i <= pagination.pageCount; i++){
        appendPageNumber(i, pagination);
    }

    // SET SELECTOR TO PAGINATION OBJECT
    pagination.paginationNumber = document.querySelectorAll(".pagination-number");
}

function appendPageNumber(index, pagination){
    const newBtnNumber = document.createElement('button');

    newBtnNumber.className = "pagination-number";
    newBtnNumber.innerHTML = index;
    newBtnNumber.setAttribute("page-index", index);
    newBtnNumber.setAttribute("aria-label", `Page ${index}`);

    pagination.paginationNumbers.appendChild(newBtnNumber);
}








if(document.querySelector(".folder-container")){
    
}