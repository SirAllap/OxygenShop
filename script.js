const modal = document.querySelector('.newsletter')
const mainContainer = document.querySelector('.main-container')
const emailChecker = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
)
const arrFixedNumPricing = []

window.onload = () => {
    history.scrollRestoration = 'manual'

    document
        .querySelector('#submit-btn')
        .addEventListener('click', (event) => {
            event.preventDefault()
        })

    document
        .querySelector('#modal-submit-btn')
        .addEventListener('click', (event) => {
            event.preventDefault()
        })

    if (localStorage.getItem('modalViewed') === null) {
        setTimeout(() => {
            modal.classList.add('modal-on')
            mainContainer.style.opacity = "0.5"
        }, 5000)
    }
}

window.onresize = (e) => {
    window.innerWidth >= 960
        ? document.querySelector('.header').classList.remove('open')
        : false
}

document.addEventListener('DOMContentLoaded', () => {
    const barraprogreso = document.querySelector('.porcentaje-barra')
    const botonTop = document.querySelector('.top')
    const headerOpacity = document.querySelector('.header')

    window.addEventListener('scroll', () => {
        let alturaUsuario = document.documentElement
        let scrollArriba = alturaUsuario.scrollTop || document.body.scrollTop
        let scrollAltura = alturaUsuario.scrollHeight || document.body.scrollHeight
        let porcen = (scrollArriba / (scrollAltura - alturaUsuario.clientHeight)) * 100
        barraprogreso.style.width = Math.round(porcen) + '%'
        window.addEventListener('scroll', () => {
            if (window.Math.round(porcen) === 25 && localStorage.getItem('modalViewed') === null) {
                modalOff = true
                modal.classList.add('modal-on')
                mainContainer.style.opacity = "0.5"
            }
            if (window.Math.round(porcen) > 90) {
                botonTop.classList.add('active')
            }
            if (window.Math.round(porcen) < 75) {
                botonTop.classList.remove('active')
            }
            if (window.Math.round(porcen) > 2) {
                headerOpacity.classList.add('active')
            }
            if (window.Math.round(porcen) < 2) {
                headerOpacity.classList.remove('active')
            }
        })
    })
})

document.addEventListener('keydown', (k) => {
    if (k.keyCode === 27 && localStorage.getItem('modalViewed') === null) closethemodal()
})

document.addEventListener('click', (e) => {
    if (
        modal.classList.contains('modal-on') &&
        (e.target.matches('.newsletter__modal-close-icon') ||
            !e.target.closest('.newsletter'))
    ) {
        return closethemodal(), mainContainer.style.opacity = "1"
    } else if (e.target.matches('.newsletter__modal-close-icon')) {
        return closethemodal()
    } else if (e.target.matches('.screen3__form-btn')) {
        return validateForm()
    } else if (e.target.matches('.newsletter__modal-form-btn')) {
        return subscribeToNewsletter()
    } else if (e.target.matches('.header__burger-icon')) {
        return document.querySelector('.header').classList.add('open')
    } else if (e.target.matches('.header__close-icon')) {
        return document.querySelector('.header').classList.remove('open')
    }
})

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

const validateForm = () => {
    const formInputName = document.querySelector('#info-form input[type="text"]')
    const formInputEmail = document.querySelector('#info-form input[type="email"]')
    const namestr = formInputName.value
    const emailstr = formInputEmail.value
    const formInputCheckbox = document.querySelector('input[type="checkbox"]')
    const confirmationMsg = document.querySelector('#confirmation')
    const arrClass = [formInputName, formInputEmail, formInputCheckbox]
    let confirmationVal = 0

    if (formInputName.value.length <= 2 || formInputName.value.length >= 100 || !formInputName.value) {
        formInputName.classList.add('valid')
    } else formInputName.classList.remove('valid'), confirmationVal++

    if (!emailChecker.test(formInputEmail.value.toLowerCase())) {
        formInputEmail.classList.add('valid')
    } else formInputEmail.classList.remove('valid'), confirmationVal++

    if (!formInputCheckbox.checked) {
        formInputCheckbox.classList.add('valid')
    } else formInputCheckbox.classList.remove('valid'), confirmationVal++

    if (confirmationVal === 3) {
        arrClass.forEach((e) => e.classList.remove('valid'))
        document.querySelector('#submit-btn').innerHTML = 'Sending...'
        fetchingData(namestr, emailstr)
        setTimeout((namestr, emailstr) => {
            formInputName.value = ''
            formInputEmail.value = ''
            formInputCheckbox.checked = false
            document.querySelector('#submit-btn').innerHTML = 'Send'
            confirmationMsg.innerHTML = ' '
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
                confirmationMsg.innerHTML = 'Your data has been successfully received!'
                confirmationMsg.classList.add('confirmationMsg')
            })
            .catch((err) => {
                console.log(`error ${err}`)
            })
    }
}

const subscribeToNewsletter = () => {
    const modalInputEmail = document.querySelector(
        '#modal-form input[type="email"]'
    )
    const modalEmail = modalInputEmail.value
    const modalTitle = document.querySelector('.newsletter__modal-title')
    const modalBtn = document.querySelector('.newsletter__modal-form-btn')

    if (!emailChecker.test(modalInputEmail.value.toLowerCase())) {
        modalInputEmail.classList.add('valid')
    } else {
        fetchingDataFromModal(modalEmail)
        modalInputEmail.classList.remove('valid')
        setTimeout(() => {
            modalInputEmail.value = ''
            localStorage.setItem('modalViewed', true)
            modalTitle.classList.remove('info-msg')
            modal.classList.remove('modal-on')
            modalBtn.classList.remove('none-btn')
            mainContainer.style.opacity = "1"
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
                modalTitle.classList.add('info-msg')
                modalBtn.classList.add('none-btn')
            })
            .catch((err) => {
                console.log(`error ${err}`)
            })
    }
}

const closethemodal = () => {
    localStorage.setItem('modalViewed', true)
    modal.classList.remove('modal-on'), mainContainer.style.opacity = "1"
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
            const d = document.createElement('SPAN')
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
        this.currentIndex =
            (this.currentIndex - 1 + this.totalImages) % this.totalImages
        this.showImg()
    }
    showImg() {
        for (let i = 0;i < this.images.length;i++) {
            if (i === this.currentIndex) {
                this.images[i].classList.add('current'),
                    this.dots[i].classList.add('current')
            } else {
                this.images[i].classList.remove('current'),
                    this.dots[i].classList.remove('current')
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
        this.images[e].classList.add('current'),
            this.dots[e].classList.add('current')

        setTimeout(() => {
            this.timer()
        }, 1000)
    }
}

const sl = new Slider('slider')
sl.startSlider()

document.addEventListener('click', (e) => {
    e.target.matches('.next')
        ? sl.nextSlide()
        : e.target.matches('.prev')
            ? sl.prevSlide()
            : false
    const arr = document.querySelectorAll('.dot')
    if (e.target.matches('.dot')) {
        var i = [...arr].indexOf(e.target)
        sl.matchDot2Img(i)
    } else {
        false
    }
})
