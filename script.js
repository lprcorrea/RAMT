const firebaseUrl = "https://crudjs-5c648-default-rtdb.firebaseio.com/";

document.addEventListener('DOMContentLoaded', () => {
    // Verifica se estamos na página de cadastro e adiciona o evento de submit
    if (document.getElementById('formCadastro')) {
        // Verifica se há dados na URL para preencher o formulário de edição
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            preencherFormularioParaEdicao(id); // Preenche os dados para edição
        }
        
        document.getElementById('formCadastro').addEventListener('submit', cadastrarOuAtualizarCidadão);
    }

    // Verifica se estamos na página de gerenciamento e lista os cidadãos
    if (document.getElementById('listaCidadãos')) {
        listarCidadãos();
    }
});

async function cadastrarOuAtualizarCidadão(event) {
    event.preventDefault();

    // Coleta os dados do formulário
    const nome = document.getElementById('nome').value;
    const sobrenome = document.getElementById('sobrenome').value;
    const nomePai = document.getElementById('nomePai').value;
    const nomeMae = document.getElementById('nomeMae').value;
    const dataNascimento = document.getElementById('dataNascimento').value;
    const localNascimento = document.getElementById('localNascimento').value;
    const tipoSanguineo = document.querySelector('input[name="tipoSanguineo"]:checked').value;

    const novoCidadão = {
        nome,
        sobrenome,
        nomePai,
        nomeMae,
        dataNascimento,
        localNascimento,
        tipoSanguineo,
        ativo: true
    };

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id'); // Obtemos o ID do cidadão da URL

    if (id) {
        // Se existe um ID, é um caso de edição, então atualizamos o cidadão
        const response = await fetch(`${firebaseUrl}/cidadãos/${id}.json`, {
            method: 'PUT',
            body: JSON.stringify(novoCidadão)
        });

        if (response.ok) {
            alert('Cidadão atualizado com sucesso!');
            window.location.href = 'gerenciamento.html'; // Redireciona para a página de gerenciamento
        } else {
            alert('Erro ao atualizar cidadão!');
        }
    } else {
        // Se não existe ID, estamos criando um novo cidadão
        const response = await fetch(`${firebaseUrl}/cidadãos.json`, {
            method: 'POST',
            body: JSON.stringify(novoCidadão)
        });

        if (response.ok) {
            alert('Cidadão cadastrado com sucesso!');
            window.location.href = 'gerenciamento.html'; // Redireciona para a página de gerenciamento
        } else {
            alert('Erro ao cadastrar cidadão!');
        }
    }
}

async function listarCidadãos() {
    const response = await fetch(`${firebaseUrl}/cidadãos.json`);
    const dados = await response.json();

    const listaCidadãos = document.getElementById('listaCidadãos');
    listaCidadãos.innerHTML = '';

    for (const [id, cidadão] of Object.entries(dados)) {
        const divCidadão = document.createElement('div');
        divCidadão.classList.add('cidadão-info');
        divCidadão.innerHTML = `
            <p><strong>N° de Cidadania Regional</strong> ${id}</p>
            <p><strong>Nome:</strong> ${cidadão.nome} ${cidadão.sobrenome}</p>
            <p><strong>Tipo Sanguíneo:</strong> ${cidadão.tipoSanguineo}</p>
            <p><strong>Local de Nascimento:</strong> ${cidadão.localNascimento}</p>
            <p><strong>Data de Nascimento:</strong> ${cidadão.dataNascimento}</p>
            <div class="actions">
                <button onclick="editarCidadão('${id}')">Editar</button>
                <button onclick="excluirCidadão('${id}')">Excluir</button>
            </div>
        `;
        listaCidadãos.appendChild(divCidadão);
    }
}

async function editarCidadão(id) {
    // Redireciona para a página de cadastro com o ID do cidadão na URL
    window.location.href = `cadastro.html?id=${id}`;
}

async function preencherFormularioParaEdicao(id) {
    const response = await fetch(`${firebaseUrl}/cidadãos/${id}.json`);
    const cidadão = await response.json();

 // Preenche os campos do formulário com os dados do cidadão
    document.getElementById('nome').value = cidadão.nome;
    document.getElementById('sobrenome').value = cidadão.sobrenome;
    document.getElementById('nomePai').value = cidadão.nomePai;
    document.getElementById('nomeMae').value = cidadão.nomeMae;
    document.getElementById('dataNascimento').value = cidadão.dataNascimento;
    document.getElementById('localNascimento').value = cidadão.localNascimento;
    document.querySelector(`input[name="tipoSanguineo"][value="${cidadão.tipoSanguineo}"]`).checked = true;

    // Alterar o texto do botão para "Atualizar" quando estiver no modo de edição
    const botao = document.querySelector('button[type="submit"]');
    if (botao) {
        botao.textContent = 'Atualizar'; // Mudamos o texto para "Atualizar"
    }

    // Alterar o título da página para "Editar Cidadão"
    const titulo = document.querySelector('h1');
    if (titulo) {
        titulo.textContent = 'Editar Cidadão'; // Altera o título
    }
}

async function excluirCidadão(id) {
    const confirmar = confirm("Você tem certeza de que deseja excluir este cidadão?");
    if (confirmar) {
        await fetch(`${firebaseUrl}/cidadãos/${id}.json`, {
            method: 'DELETE'
        });
        alert('Cidadão excluído com sucesso!');
        window.location.reload(); // Recarregar a página para refletir a exclusão
    }
}