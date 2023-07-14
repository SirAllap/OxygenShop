document.addEventListener("DOMContentLoaded", function () {
    const barraprogreso = document.querySelector('.porcentaje-barra')

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

        barraprogreso.style.width = Math.round(porcen) + "%"
    })
})