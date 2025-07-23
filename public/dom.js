let checkbox = document.getElementById("switchCheckReverse");
checkbox.addEventListener("click",()=>{
    console.log("checkbox was clicked");
    let tax = document.getElementsByClassName("tax");
    for(let taxes of tax){
        if(checkbox.checked){
        taxes.style.display="inline";
        }
        else{
         taxes.style.display="none";
        }
    }
})