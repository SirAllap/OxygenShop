// this is used to know when the whole DOM elements are loaded
document.addEventListener("DOMContentLoaded", function () {
    // saves the html element div of the percentaje bar
    const barraprogreso = document.querySelector('.porcentaje-barra')

    // saves the html element where the button is
    const botonTop = document.querySelector('.top')

    // when we scroll this event starts running
    window.addEventListener('scroll', function () {
        // selecting the current height of the user browser
        let alturaUsuario = document.documentElement
        // console.log(alturaUsuario);
        // console.log(alturaUsuario.clientHeight);

        // distance to the top side of the current current position
        let scrollArriba = alturaUsuario.scrollTop || document.body.scrollTop
        // console.log(scrollArriba);

        // The whole height of the page (will vary depend on the device, screen size...)
        let scrollAltura = alturaUsuario.scrollHeight || document.body.scrollHeight
        // console.log(scrollAltura);

        // Divide the distance from the top side of the current browser window by(/) (the whole height of the page - current height of the user browser) *100
        let porcen = scrollArriba / (scrollAltura - alturaUsuario.clientHeight) * 100
        // console.log(porcen)
        // console.log(Math.round(porcen))

        // change the CSS "width" style dynamically
        barraprogreso.style.width = Math.round(porcen) + "%"

        // when we scroll this event starts running
        window.addEventListener("scroll", function () {
            // the percertaje of the scroll is 10 or higer we will add to the HTML the "active" class if it's smoller than 10 it will remove "active" class if exist
            if (window.Math.round(porcen) > 95) {
                // var activateButton = setTimeout(() => {
                //     botonTop.classList.add("active")
                // }, 200)
                botonTop.classList.add("active")
            } else if (window.Math.round(porcen) < 90) {
                botonTop.classList.remove("active")
            }
        })
    })
});

// this will prevent the button of the form to refresh the page
document.querySelector('#submit-btn').addEventListener('click', function (event) {
    event.preventDefault();
});

function validateForm() {
    const formInputName = document.querySelector('input[type="text"]')
    const formInputEmail = document.querySelector('input[type="email"]')
    const namestr = formInputName.value
    const emailstr = formInputEmail.value
    const formInputCheckbox = document.querySelector('input[type="checkbox"]')
    // saves all the inputs into an array to clean the style 
    const arrStyles = [formInputName, formInputEmail, formInputCheckbox]
    const emailChecker = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

    if (formInputName.value.length <= 2 || formInputName.value.length >= 100) {
        formInputName.style.cssText = 'border-width: 0 0 2px 0;border-color: rgb(255, 0, 0);'
    } else if (!emailChecker.test(formInputEmail.value.toLowerCase())) {
        formInputEmail.style.cssText = 'border-width: 0 0 2px 0;border-color: rgb(255, 0, 0);'
    } else if (!formInputCheckbox.checked) {
        formInputCheckbox.style.cssText = 'outline: 2px solid #ff0303;'
    } else {
        arrStyles.forEach(e => e.removeAttribute('style'))
        document.querySelector("#submit-btn").innerHTML = "Sending..."
        fetchingData(namestr, emailstr)
        setTimeout(function (namestr, emailstr) {
            formInputName.value = ""
            formInputEmail.value = ""
            formInputCheckbox.checked = false
            document.querySelector("#submit-btn").innerHTML = "Send"
            document.querySelector("#confirmation").innerHTML = " "
            document.querySelector("#confirmation").removeAttribute('style')
        }, 1500)
    }
}

async function fetchingData(n, e) {
    try {
        fetch('https://jsonplaceholder.typicode.com/users', {
            method: 'POST',
            body: JSON.stringify({
                name: n,
                email: e,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(() => {
                document.querySelector("#confirmation").innerHTML = "Your data has been successfully received!"
                document.querySelector("#confirmation").style.cssText = 'position: absolute;background-color: #55dfb4;font-weight: 600;border-radius: 10px;padding: 15px;'
            })
    } catch (error) {
        console.log(error)
    }
}