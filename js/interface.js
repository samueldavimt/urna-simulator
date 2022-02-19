let container = document.querySelector('.tela')

document.querySelectorAll('.botao').forEach(botao=>{
    botao.addEventListener('click',add_numero)
})

let votos = []
let num_clicados = 0
let numeroDeEtapas = etapas.length
let etapaAtual = 0
let numero_digitado = ''
let votar_bloqueio = false


function mostrar_cardsCandidatos(){
    let container_cards = document.querySelector('.container-cards')
    container_cards.innerHTML = ''

    let etapa = etapas[etapaAtual]
    
    for(let candidato of etapa.candidatos){
        let card = document.createElement('div')
        card.classList.add('card-candidato')

        let posicao_candidato = document.createElement('p')
        posicao_candidato.id = 'posicao-cadidatoCard'
        posicao_candidato.innerHTML = candidato.nome

        let container_imgCandidato = document.createElement('div')
        container_imgCandidato.classList.add("img-cardCandidato")
        let img_candidato = document.createElement('img')
        img_candidato.src = candidato.img

        container_imgCandidato.appendChild(img_candidato)

        let numero_candidato = document.createElement("numero-cardCandidato")
        numero_candidato.id = 'numero-cardCandidato'

        numero_candidato.innerHTML = candidato.numero

        card.appendChild(posicao_candidato)
        card.appendChild(container_imgCandidato)
        card.appendChild(numero_candidato)

        container_cards.appendChild(card)
        document.querySelector('#titulo-cards').innerHTML = `Candidatos a ${etapa.titulo}(a)`

    }

}


function add_numero(e){

    let botoes_preencher = document.querySelectorAll('.tela .container_blocos_numero_voto .bloco')
    if(Number(e) || e == 0){
         botoes_preencher[num_clicados].innerText = e
          numero_digitado += e
    }else{
        botoes_preencher[num_clicados].innerText = Number(e.target.innerText)
        numero_digitado += e.target.innerText
    }
   
    num_clicados++   

    let resposta = verificar_candidato()
    if(resposta != false){
        display_info(resposta, true)
        votar_bloqueio = true
        let sessao = resposta.legenda
        let resp_voto = `{"${sessao}":"${resposta.nome}", "partido": "${resposta.partido}"}`
        votos[etapaAtual] = JSON.parse(resp_voto)
    }else if(resposta == false && num_clicados == botoes_preencher.length){
       display_info('',false)
    }
}

window.addEventListener("keyup",function(e){
    if(parseInt(e.key) || e.key == 0 ){
        add_numero(e.key)
        
       
    }
})


function display_info(resposta, tipo_display){
    container.innerHTML = ''
    let container_info = document.querySelector('.informacoes_escolhido')
    let info_screen = container_info.cloneNode(true)

    info_screen.style.display = 'flex'

    let container_numero = info_screen.children[0].children[2].children[1]


    if(tipo_display == true){
        info_screen.children[0].children[1].innerHTML = resposta.legenda

        info_screen.children[0].children[3].innerHTML = "Nome: " + resposta.nome
        info_screen.children[0].children[4].innerHTML = "Partido: " + resposta.partido

        info_screen.children[1].children[0].src = resposta.img
    }else{
        info_screen.children[0].children[1].innerHTML = etapas[etapaAtual].titulo

        info_screen.children[0].children[3].innerHTML = 'Candidato Inexistente'
        info_screen.children[0].children[3].style.fontSize = '35px'


    }
    let nums = numero_digitado.split('')
    for(let n of nums){
        let num = document.createElement('p')
        num.innerHTML = n;
        container_numero.appendChild(num)
    }

    container.appendChild(info_screen)
}

function verificar_candidato(){
    let candidato_escolhido = false
    for(let candidato of etapas[etapaAtual].candidatos){
        let numero = candidato.numero
        if(numero == Number(numero_digitado)){
           candidato_escolhido = candidato
        }
    }

    return candidato_escolhido
}


function comecarEtapa(){
    container.innerHTML = ''
    if(etapaAtual == etapas.length){
        display_fim()

    }else{
        let etapa = etapas[etapaAtual]
    gerar_tela_voto(etapa.titulo, etapa.numeros)
    mostrar_cardsCandidatos()
    } 
}

function display_fim(){
   
    let container_fim = document.querySelector('.fim')
    let fim_screen = container_fim.cloneNode(true)
    fim_screen.style.display = 'flex'

    container.innerHTML = ''
    container.appendChild(fim_screen)
    document.querySelector('.cards').style.width  = '0px'
    document.querySelector('.urna-container').classList.add("urna-full-width")
}

function gerar_tela_voto(titulo_etapa, num_numeros){
    let tela_voto = document.querySelector('.voto')
    let tela_nova = tela_voto.cloneNode(true)

    tela_nova.style.display = 'block'
    let container_blocos = tela_nova.children[1]
    let titulo = tela_nova.children[0]
    titulo.innerText = titulo_etapa
    for(let c=0;c<num_numeros;c++){
        let bloco = document.createElement('div')
        bloco.classList.add('bloco')
        container_blocos.appendChild(bloco)
    }
    
    container.appendChild(tela_nova)
}

comecarEtapa()

function voto_confirma(){
   if(votar_bloqueio){
    reiniciar()
    document.querySelector('.tela').innerHTML = ''
    etapaAtual ++
    comecarEtapa()
    console.log(votos)
   }
}


function reiniciar(){
    num_clicados = 0
    numero_digitado = ''
    votar_bloqueio = false
}

function voto_branco(){
    
    reiniciar()
    let sessao = etapas[etapaAtual].titulo
    let resp_voto = `{"${sessao}":"Branco"}`
    votos[etapaAtual] = JSON.parse(resp_voto)
    
    etapaAtual++

    comecarEtapa()
}

function voto_corrige(){
    reiniciar()
    comecarEtapa()
}