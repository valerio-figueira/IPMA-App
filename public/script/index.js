
/*
if(document.querySelector(".form-cadastro")){
    const form = document.querySelector(".form-cadastro");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
}
*/



/* CHECK CPF INPUT */
if(document.querySelector("#cpf")){
    const inputCPF = document.querySelector("#cpf");

    inputCPF.addEventListener("keypress", (e) => {
        const regex = /[0-9]/;

        if(e.target.value.length == 3){
            e.target.value += "."
        }

        if(e.target.value.length == 7){
            e.target.value += "."
        }

        if(e.target.value.length == 11){
            e.target.value += "-"
        }

        if(e.target.value.length == 14){
            e.preventDefault();
        }

        if(!regex.test(e.key)){
            e.target.style.backgroundColor = "#ffd2d2"
            e.preventDefault();            
        } else{
            e.target.style.backgroundColor = "transparent"
        }

    })
}

if(document.querySelector("#matricula")){
    document.querySelector("#matricula")
    .addEventListener("keypress", (e) => {
        const regex = /[0-9]/;

        if(e.target.value.length == 15){
            e.preventDefault();
        }
        
        if(!regex.test(e.key)){
            e.preventDefault();
        }
    })
}

if(document.querySelector("#nome")){
    document.querySelector("#nome")
    .addEventListener("keypress", (e) => {
        const regex = /[A-z-\s]/

        if(e.target.value.length == 60){
            e.preventDefault();
        }

        if(!regex.test(e.key)){
            e.target.style.backgroundColor = "#ffd2d2"
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent"
        }
    })
}

if(document.querySelector("#emissor")){
    document.querySelector("#emissor")
    .addEventListener("keypress", (e) => {
        if(e.target.value.length == 7){
            e.preventDefault();
        }
    })
}