const modal = document.querySelector('.newsletter')
const emailChecker = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
)
const checkModalViewed = localStorage.getItem('modalViewed')
const arrFixedNumPricing = []

window.onload = function () {
    // on reload the page will go straight to the top
    history.scrollRestoration = 'manual'

    // this will prevent the button of the form to refresh the page
    document
        .querySelector('#submit-btn')
        .addEventListener('click', function (event) {
            event.preventDefault()
        })

    // this will prevent the button of the modal to refresh the page
    document
        .querySelector('#modal-submit-btn')
        .addEventListener('click', function (event) {
            event.preventDefault()
        })

    if (checkModalViewed === null) {
        // * bad practice to change the style directly on the HTML elements
        // ! setTimeout(() => { modal.style.cssText = 'display: block;' }, 5000)
        // * Instead we add or remove a class to change the style
        setTimeout(() => {
            modal.classList.add('modal-on')
        }, 5000)
    }
}

// ? on resize will change the menu for mobile or desktop view
window.onresize = (e) => {
    window.innerWidth >= 960
        ? document.querySelector('.header').classList.remove('open')
        : false
}

// ? on DOM loaded the events will be tracking the scrolling to "move" the progressbar
document.addEventListener('DOMContentLoaded', function () {
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
        let porcen =
            (scrollArriba / (scrollAltura - alturaUsuario.clientHeight)) * 100
        // console.log(porcen)
        // console.log(Math.round(porcen))

        // change the CSS "width" style dynamically
        barraprogreso.style.width = Math.round(porcen) + '%'

        // when we scroll this event starts running
        window.addEventListener('scroll', function () {
            // the percertaje of the scroll is 10 or higer we will add to the HTML the "active" class if it's smoller than 10 it will remove "active" class if exist
            if (window.Math.round(porcen) === 25 && checkModalViewed === null) {
                // ! document.querySelector('.newsletter').style.cssText = 'display: block;'
                modal.classList.add('modal-on')
            } else if (window.Math.round(porcen) > 95) {
                // var activateButton = setTimeout(() => {
                //     botonTop.classList.add("active")
                // }, 200)
                botonTop.classList.add('active')
            } else if (window.Math.round(porcen) < 80) {
                botonTop.classList.remove('active')
            }
        })
    })
})

// ? when modal shows if you press ESC key will call 'closethemodal' function
document.addEventListener('keydown', (k) => {
    if (k.keyCode === 27 && checkModalViewed === null) closethemodal()
})

// ? this function is taking care of closing the modal if we click outside when modal is on
// ? & we click "x" icon inside modal will call 'closethemodal' function
// ? & we click the form submnit button will call 'validateForm' function
// ? & we click the modal submnit button will call 'subscribeToNewsLetter' function
// ? & we click the burguer menu icon will add class to open it
// ? & we click the close menu icon will remove class to close it
document.addEventListener('click', (e) => {
    modal.classList.contains('modal-on') &&
        (e.target.matches('.newsletter__modal-close-icon') ||
            !e.target.closest('.newsletter'))
        ? closethemodal()
        : e.target.matches('.newsletter__modal-close-icon')
            ? closethemodal()
            : e.target.matches('.screen3__form-btn')
                ? validateForm()
                : e.target.matches('.newsletter__modal-form-btn')
                    ? subscribeToNewsletter()
                    : e.target.matches('.header__burger-icon')
                        ? document.querySelector('.header').classList.add('open')
                        : e.target.matches('.header__close-icon')
                            ? document.querySelector('.header').classList.remove('open')
                            : false
})

// ? this is handeling when we change the type of currency form the select dropdown, we also handle the async function to handle the GET request
document.querySelector('#currency-select').addEventListener('change', () => {
    const currSelector = document.querySelector('#currency-select')
    const currSymbol = document.querySelectorAll(
        '.screen3__pricing-all-card-left-currency-symbol'
    )
    const currNumber = document.querySelectorAll(
        '.screen3__pricing-all-card-left-currency-number'
    )
    arrFixedNumPricing.length === 0
        ? currNumber.forEach((e) => arrFixedNumPricing.push(Number(e.innerHTML)))
        : false
    if (currSelector.options[currSelector.selectedIndex].innerText === 'EUR') {
        return (
            currSymbol.forEach((e) => (e.innerHTML = '€')),
            resetPrices(),
            fetchDataFromCurrencyAPI('eur')
        )
    } else if (
        currSelector.options[currSelector.selectedIndex].innerText === 'GBP'
    ) {
        return (
            currSymbol.forEach((e) => (e.innerHTML = '£')),
            resetPrices(),
            fetchDataFromCurrencyAPI('gbp')
        )
    } else {
        return (
            currSymbol.forEach((e) => (e.innerHTML = '$')),
            fetchDataFromCurrencyAPI('usd')
        )
    }

    function resetPrices() {
        currNumber.forEach((p, i) => (p.innerHTML = arrFixedNumPricing[i]))
    }

    async function fetchDataFromCurrencyAPI(c) {
        try {
            const response = await fetch(
                'https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/usd.json'
            )
            const currencies = await response.json()

            c === 'eur'
                ? currNumber.forEach(
                    (e) =>
                    (e.innerHTML = Math.round(
                        Number(e.innerHTML) * currencies.usd.eur
                    ))
                )
                : c === 'gbp'
                    ? currNumber.forEach(
                        (e) =>
                        (e.innerHTML = Math.round(
                            Number(e.innerHTML) * currencies.usd.gbp
                        ))
                    )
                    : resetPrices()
        } catch (error) {
            console.log(error)
        }
    }
})

// ? this function is taking care of the validation of the form inputs and fetching the information to a JSON server
function validateForm() {
    const formInputName = document.querySelector('#info-form input[type="text"]')
    const formInputEmail = document.querySelector(
        '#info-form input[type="email"]'
    )
    const namestr = formInputName.value
    const emailstr = formInputEmail.value
    const formInputCheckbox = document.querySelector('input[type="checkbox"]')
    const confirmationMsg = document.querySelector('#confirmation')
    // saves all the inputs into an array to clean the style
    const arrClass = [formInputName, formInputEmail, formInputCheckbox]

    if (formInputName.value.length <= 2 || formInputName.value.length >= 100) {
        // ! formInputName.style.cssText = 'border-width: 0 0 2px 0;border-color: rgb(255, 0, 0);'
        formInputName.classList.add('valid')
    } else if (!emailChecker.test(formInputEmail.value.toLowerCase())) {
        // ! formInputEmail.style.cssText = 'border-width: 0 0 2px 0;border-color: rgb(255, 0, 0);'
        formInputEmail.classList.add('valid')
    } else if (!formInputCheckbox.checked) {
        // ! formInputCheckbox.style.cssText = 'outline: 2px solid #ff0303;'
        formInputCheckbox.classList.add('valid')
    } else {
        arrClass.forEach((e) => e.classList.remove('valid'))
        document.querySelector('#submit-btn').innerHTML = 'Sending...'
        fetchingData(namestr, emailstr)
        setTimeout(function (namestr, emailstr) {
            formInputName.value = ''
            formInputEmail.value = ''
            formInputCheckbox.checked = false
            document.querySelector('#submit-btn').innerHTML = 'Send'
            confirmationMsg.innerHTML = ' '
            // ! document.querySelector("#confirmation").removeAttribute('style')
            confirmationMsg.classList.remove('confirmationMsg')
        }, 2000)
    }
    async function fetchingData(n, e) {
        const url = 'https://jsonplaceholder.typicode.com/posts'
        const options = {
            method: 'POST',
            body: JSON.stringify({
                name: n,
                email: e,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }
        const data = await fetch(url, options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
            .then(() => {
                confirmationMsg.innerHTML =
                    'Your data has been successfully received!'
                // ! confirmationMsg.style.cssText = 'position: absolute;background-color: #55dfb4;font-weight: 600;border-radius: 10px;padding: 15px;'
                confirmationMsg.classList.add('confirmationMsg')
            })
            .catch((err) => {
                console.log(`error ${err}`)
            })
    }
}

// ? this function is taking care of the validation of the modal input and fetching the information to a JSON server
function subscribeToNewsletter() {
    const modalInputEmail = document.querySelector(
        '#modal-form input[type="email"]'
    )
    const modalEmail = modalInputEmail.value
    const modalTitle = document.querySelector('.newsletter__modal-title')
    const modalBtn = document.querySelector('.newsletter__modal-form-btn')

    if (!emailChecker.test(modalInputEmail.value.toLowerCase())) {
        // ! modalInputEmail.style.cssText = 'border-width: 0 0 2px 0;border-color: rgb(255, 0, 0);'
        modalInputEmail.classList.add('valid')
    } else {
        fetchingDataFromModal(modalEmail)
        // ! modalInputEmail.removeAttribute('style')
        modalInputEmail.classList.remove('valid')
        setTimeout(function () {
            modalInputEmail.value = ''
            localStorage.setItem('modalViewed', true)
            // ! modalTitle.removeAttribute('style')
            modalTitle.classList.remove('info-msg')
            // ! modal.style.cssText = 'display: none;'
            modal.classList.remove('modal-on')
            modalBtn.classList.remove('none-btn')
        }, 2000)
    }
    async function fetchingDataFromModal(e) {
        const url = 'https://jsonplaceholder.typicode.com/posts'
        const options = {
            method: 'POST',
            body: JSON.stringify({
                email: e,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }
        const data = await fetch(url, options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
            })
            .then(() => {
                modalTitle.innerHTML = 'You has been successfully subscribed!'
                // !document.querySelector(".newsletter__modal-title").style.cssText = 'position: absolute;background-color: #55dfb4;font-weight: 900;border-radius: 10px;padding: 15px; width: 280px; color: #434d57; text-align: center;'
                modalTitle.classList.add('info-msg')
                modalBtn.classList.add('none-btn')
            })
            .catch((err) => {
                console.log(`error ${err}`)
            })
    }
}

// ? this function is taking care of closing modal by removing the class and adding it to the localStorage so it wont show again if we already close it
function closethemodal() {
    localStorage.setItem('modalViewed', true)
    // ! modal.style.cssText = 'display: none;'
    modal.classList.remove('modal-on')
}

class Slider {
    constructor(sliderId) {
        this.slider = document.querySelector(`#${sliderId}`)
        this.images = this.slider.querySelectorAll('img')
        this.currentIndex = 0
        this.totalImages = this.images.length
        this.dots = null
        this.t
    }
    startSlider() {
        const bread = document.querySelector('.img-slider__dots-container')
        this.images.forEach((e, i) => {
            const d = document.createElement("SPAN")
            d.classList.add('material-symbols-outlined', 'dot', `${i}`)
            const t = document.createTextNode('fiber_manual_record')
            d.appendChild(t)
            bread.appendChild(d)
        })
        this.dots = document.querySelectorAll('.dot')
        this.showImg()
        this.timer()
    }
    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalImages
        this.showImg()
    }
    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalImages) % this.totalImages
        this.showImg()
    }
    showImg() {
        for (let i = 0;i < this.images.length;i++) {
            if (i === this.currentIndex) {
                this.images[i].classList.add('current'), this.dots[i].classList.add('current')
            } else {
                this.images[i].classList.remove('current'), this.dots[i].classList.remove('current')
            }
        }
    }
    timer() {
        this.t = setInterval(() => {
            this.nextSlide()
        }, 3000)
    }
    pause() {
        return clearInterval(this.t)
    }
    matchDot2Img(e) {
        this.pause()
        this.images.forEach((ele, i) => {
            ele.classList.remove('current')
            this.dots[i].classList.remove('current')
        })
        this.images[e].classList.add('current'), this.dots[e].classList.add('current')

        setTimeout(() => {
            this.timer()
        }, 1000)
    }
}

const sl = new Slider('slider')
sl.startSlider()

document.addEventListener('click', (e) => {
    e.target.matches('.next') ? sl.nextSlide()
        : e.target.matches('.prev') ? sl.prevSlide()
            : false
    const arr = document.querySelectorAll('.dot')
    if (e.target.matches('.dot')) {
        var i = [...arr].indexOf(e.target); sl.matchDot2Img(i)
    } else {
        false
    }
})