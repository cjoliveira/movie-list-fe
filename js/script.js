/**
 * CARREGA ITENS POPULARES
 */
fetch('http://localhost:8080/filmes/buscar-populares') 
    .then(response => response.json())
    .then(data => {

        data.forEach(objeto => {

            const pop = document.getElementById("populares");

            const model = document.createElement("div");
            model.classList.add("item-pop");
            model.style.backgroundImage = `url("${objeto.url_foto}")`;

            const lancamento = new Date(objeto.data_lancamento);
            const anoFilme = lancamento.getFullYear();

            model.innerHTML = `<p class="titulo-filme">${objeto.titulo}</p>
                               <p class="ano-filme">${anoFilme}</p>`

            pop.appendChild(model);


        });

    })
    .catch(error => console.log(error));



/**
 * CARREGA CATÁLOGO DE FILMES
 */
fetch('http://localhost:8080/filmes')
    .then(response => response.json())
    .then(data => {

        data.forEach(objeto => {

            const cat = document.getElementById("catalogo");

            const model = document.createElement("div");
            model.classList.add("item-catalogo");
            model.style.backgroundImage = `url("${objeto.url_foto}")`;

            const lancamento = new Date(objeto.data_lancamento);
            const anoFilme = lancamento.getFullYear();

            model.innerHTML = `
            <div class="div-check"><input id="${objeto.id}" onchange="checkboxAlterado(this)" class="check" type="checkbox" name="check" value="${objeto.id}"></div>
                               <p class="titulo-filme">${objeto.titulo}</p>
                               <p class="ano-filme">${anoFilme}</p>
                               `

            cat.appendChild(model);

        });
    })
    .catch(error => console.log(error));


/**
 * ABRIR MODAL COM FORMULARIO DE CADASTRO DE UM NOVO FILME
 */
const btnAbrirModal = document.getElementById('btnAbrirModal');
const modal = document.getElementById('modal');
const fundoModal = document.getElementById('fundo-modal');
const containerModal = document.getElementById('container-modal');
const btnFecharModal = modal.querySelector('.close');

btnAbrirModal.addEventListener('click', abrirModal);
btnFecharModal.addEventListener('click', fecharModal);


function abrirModal() {
    modal.style.display = 'flex';
    fundoModal.style.display = 'block';
    containerModal.style.display = 'flex';
}

function fecharModal() {
    modal.style.display = 'none';
    fundoModal.style.display = 'none';
    containerModal.style.display = 'none';
}

/**
 * FUNÇÃO DE PESQUISA DE FILMES
 */
var meuTextfield = document.getElementById("valuePesquisa");
var btnPesquisar = document.getElementById("btnPesquisar");

btnPesquisar.addEventListener("click", function () {
    const texto = meuTextfield.value;

    fetch('http://localhost:8080/filmes/buscar?' + new URLSearchParams({
        titulo: meuTextfield.value
    }), { method: 'GET' }) /** PRECISO QUE O BACKEND RETORNE UM JSON PARA QUE SEJA LIDO E EXIBIDO EM TELA */
        .then(response => response.json())
        .then(data => {

            const cat = document.getElementById("catalogo");
            cat.innerHTML = ""

            data.forEach(objeto => {

                const cat = document.getElementById("catalogo");
    
                const model = document.createElement("div");
                model.classList.add("item-catalogo");
                model.style.backgroundImage = `url("${objeto.url_foto}")`;
    
                const lancamento = new Date(objeto.data_lancamento);
                const anoFilme = lancamento.getFullYear();
    
                model.innerHTML = `
                <div class="div-check"><input id="${objeto.id}" onchange="checkboxAlterado(this)" class="check" type="checkbox" name="check" value="${objeto.id}"></div>
                                   <p class="titulo-filme">${objeto.titulo}</p>
                                   <p class="ano-filme">${anoFilme}</p>
                                   `
    
                cat.appendChild(model);
    
            });
        })
        .catch(error => console.log(error));
});

/**
 * CARREGAR CATEGORIAS
 */
fetch('http://localhost:8080/categorias')
    .then(response => response.json())
    .then(data => {

        data.forEach(objeto => {

            const sel = document.getElementById("select");
            const op = document.createElement("option");
            op.text = objeto.nome;
            op.value = objeto.id;

            sel.add(op);

        });
    })
    .catch(error => console.log(error));

/**
 * FUNÇÃO RESPONSÁVEL PELO CADASTRO DE UM NOVO FILME
 */
function salvarFilme() {

    const url = 'http://localhost:8080/filmes/cadastrar';

    //Dados do formulario
    var inputNomeFilme = document.getElementById("nome-filme");
    var inputLinkImagem = document.getElementById("link-imagem");
    var inputLancamento = document.getElementById("lancamento");
    var inputDuracao = document.getElementById("duracao");
    var inputClassificacao = document.getElementById("classificacao");
    var inputDescricao = document.getElementById("descricao");
    var select = document.getElementById("select");

    const formatoEntrada = 'DD/MM/YYYY';
    const formatoSaida = 'YYYY-MM-DD HH:mm:ss';
    const dataMoment = moment(inputLancamento.value, formatoEntrada);

    var nomeFilme = inputNomeFilme.value;
    var linkImagem = inputLinkImagem.value;
    var lancamento = dataMoment.isValid() ? dataMoment : null;
    var duracao = inputDuracao.value;
    var classificacao = inputClassificacao.value;
    var descricao = inputDescricao.value;
    var categoria = select.value;

    // Validar a data
    if (!lancamento) {
        exibirMensagemErro('A data de lançamento não está no formato correto (DD/MM/YYYY).');
        voltarTelaPrincipal();
        return;
    }

    // Dados a serem enviados no corpo da solicitação POST
    const data = {
        titulo: nomeFilme,
        duracao: duracao,
        classificacao: classificacao,
        descricao: descricao,
        data_lancamento: lancamento,
        url_foto: linkImagem,
        categoria_id: categoria
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    };

    // Enviar a solicitação POST
    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            console.log('Resposta:', data);
            exibirMensagemSucesso('Cadastro');
            voltarTelaPrincipal();
        })
        .catch(error => {
            exibirMensagemErro(error.message);
            voltarTelaPrincipal();
        });

}


/**
 *  FUNÇÃO RESPONSÁVEL POR GUARDAR OS IDS DOS FILMES MARCADOS 
 */
function checkboxAlterado(checkbox) {

    if (checkbox.checked) {
        console.log(checkbox.id + " marcado");

        var arrayIDsFilmes = [];
        //adicionando o id em um array
        if (localStorage.getItem('filmesExcluir')) {
            arrayIDsFilmes = JSON.parse(localStorage.getItem('filmesExcluir'));
        }

        //adicoonando id do filme no array
        arrayIDsFilmes.push(checkbox.id);

        //Armazenando o array
        localStorage.setItem('filmesExcluir', JSON.stringify(arrayIDsFilmes));
        console.log(arrayIDsFilmes);

    } else {
        // Checkbox foi desmarcado
        var arrayIDsFilmes = JSON.parse(localStorage.getItem('filmesExcluir'));
        var idDesejado = checkbox.id;
        var idEncontrado = null;

        for (var i = 0; i < arrayIDsFilmes.length; i++) {
            var objeto = arrayIDsFilmes[i];

            if (objeto == idDesejado) {
                idEncontrado = i;
                arrayIDsFilmes.splice(idEncontrado);
                break;
            }
        }

        localStorage.setItem('filmesExcluir', JSON.stringify(arrayIDsFilmes));

    }
}

/**
 * FUNÇÃO RESPONSÁVEL PELA EXCLUSÃO DE UM FILME
 */
const btnExcluir = document.getElementById('btnExcluir');
btnExcluir.addEventListener('click', excluirFilme);

function excluirFilme() {
    const ArrayFilmesExcluir = JSON.parse(localStorage.getItem('filmesExcluir'));

    if (ArrayFilmesExcluir.length > 0) {
        const url = `http://localhost:8080/filmes/deletar-filmes?ids=${ArrayFilmesExcluir.join(',')}`;

        // Configurações da solicitação
        const requestOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Enviar a solicitação POST
        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    exibirMensagemSucesso('Exclusão');
                } else {
                    exibirMensagemErro(response.status);
                }
                // Limpar o localStorage
                localStorage.removeItem('filmesExcluir');
                voltarTelaPrincipal();
            })
            .catch(error => {
                exibirMensagemErro(error.message);
                // Limpar o localStorage
                localStorage.removeItem('filmesExcluir');
                voltarTelaPrincipal();
            });
    } else {
        alert('Nenhum filme selecionado para exclusão');
        // Limpar o localStorage
        localStorage.removeItem('filmesExcluir');
        voltarTelaPrincipal();
    }
}

/**
 * UTILIDADES PARA TRANSIÇÃO ENTRE TELAS
 */
function exibirMensagemSucesso(mensagem) {
    alert('Função realizada com sucesso: ' + mensagem);
}

function exibirMensagemErro(mensagem) {
    alert('A operação falhou. Erro: ' + mensagem);
}

function voltarTelaPrincipal() {
    window.location.href = 'index.html';
}