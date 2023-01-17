
/*
if(document.querySelector(".form-cadastro")){
    const form = document.querySelector(".form-cadastro");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    })
}
*/

if(document.querySelector(".form-cadastro")){
    /* CHECK CPF INPUT */
    const inputCPF = document.querySelector("#cpf");

    inputCPF.addEventListener("keypress", (e) => {
        const regex = /[0-9]/;

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

        if(!regex.test(e.key)){
            e.target.style.backgroundColor = "#ffd2d2";
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

        const regex = /[A-z-\s]/;

        if(regex.test(e.target.value)){
            console.log(e.target);
            e.target.style.backgroundColor = "transparent";
        }
    })

    inputCPF.addEventListener("keyup", (e) => {
        if(e.key.match("Backspace")){
            e.target.style.backgroundColor = "transparent";
        }
    })



    /* CHECK MATRICULA INPUT */
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




    /* CHECK NOME INPUT */
    document.querySelector("#nome")
    .addEventListener("keypress", (e) => {
        const regex = /[A-z-\s]/;

        if(e.target.value.length == 60){
            e.preventDefault();
        }

        if(!regex.test(e.key)){
            e.target.style.backgroundColor = "#ffd2d2";
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }
    })
    document.querySelector("#nome")
    .addEventListener("change", (e) => {
        const regex = /[A-z-\s]/;

        if(regex.test(e.target.value)){
            console.log(e.target);
            e.target.style.backgroundColor = "transparent";
        }
    })
    document.querySelector("#nome")
    .addEventListener("keyup", (e) => {
        if(e.key.match("Backspace")){
            e.target.style.backgroundColor = "transparent";
        }
    })




    /* CHECK ORGÃO EMISSOR INPUT */
    document.querySelector("#emissor")
    .addEventListener("keypress", (e) => {
        if(e.target.value.length == 7){
            e.preventDefault();
        }
    })





    // NUMERO DE ENDEREÇO
    document.querySelector("#numero")
    .addEventListener("keypress", (e) => {
        const regex = /[0-9]/;

        if(!regex.test(e.key)){
            e.target.style.backgroundColor = "#ffd2d2";
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }       

    })

    document.querySelector("#numero")
    .addEventListener("keyup", (e) => {
        if(e.key.match("Backspace")){
            e.target.style.backgroundColor = "transparent";
        }
    })


    // CIDADE INPUT
    document.querySelector("#cidade")
    .addEventListener("keypress", (e) => {
        const regex = /[A-z-\s]/;

        if(e.target.value.length == 30){
            e.preventDefault();
        }

        if(!regex.test(e.key)){
            e.target.style.backgroundColor = "#ffd2d2";
            e.preventDefault();
        } else{
            e.target.style.backgroundColor = "transparent";
        }
    })
    document.querySelector("#cidade")
    .addEventListener("keypress", (e) => {
        const regex = /[A-z-\s]/;

        if(regex.test(e.target.value)){
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





}


