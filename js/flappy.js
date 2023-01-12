function novoElemento(tagName, className) {
    const elem = document.createElement(tagName)
    elem.className = className
    return elem
}

function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira')

    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)

    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const b = new Barreira(true)
// b.setAltura(200)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function ParDeBarreiras(altura, abertura, x) { // faz a altura do par de barreira mudar 
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)  // faz um calculo aleatório
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]) // saber a posição que o par de barreira está 
    this.setX = x => this.elemento.style.left = `${x}px`
    this.getLargura = () => this.elemento.clienteWidth

    this.sortearAbertura()
    this.setX(x)
}

// const b  =  new ParDeBarreiras(700,200,400)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [ // aqui vai criar varios pares de barreiras
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ]

    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // quando o elemento sair da tela
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura()
            }

            const meio = largura / 2
            const cruzouOMeio = par.getX() + deslocamento >= meio
                && par.getX() < meio
            if(cruzouOMeio) notificarPonto()
        })
    }
}

// function Passaro(alturaJogo) { // o passaro será animado na posição Y
//     let voando = false

//     this.elemento = novoElemento('img', 'passaro')
//     this.elemento.src = 'imgs/passaro.png'

//     this.getY = () => parseInt(this.elemento.style.botton.split('px')[0])
//     this.setY = y => this.elemento.style.botton = `${y}px`

//     window.onkeydown = e => voando = true // quando o usuario clicar em qualqer tecla, o voando recebera true
//     window.onkeyup = e => voando = false

//     this.animar = () => {
//         const novoY = this.getY() + (voando ? 8 : -5) // quanto ele ganha e quanto perde de altura quando estiver voando
//         const alturaMaxima = alturaJogo - this.elemento.clienteHeight

//         if (novoY <= 0) {
//             this.setY(0)
//         } else if (novoY >= alturaMaxima) {
//             this.setY(alturaMaxima)
//         } else {
//             this.setY(novoY)
//         }
//     }

//     this.setY(alturaJogo / 2)

// }

const barreiras = new Barreiras(700, 1200, 200, 400)
// const passaro = new Passaro(700)
const areaDoJogo = document.querySelector('[wm-flappy]')

// areaDoJogo.appendChild(passaro.elemento)
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
setInterval(() => {
    barreiras.animar()
    // passaro.animar()
}, 20)