import Departamento from "../Model/departamento.js";

export default class DepartamentoCtrl {

    
    gravar(requisicao, resposta) {
        resposta.type('application/json');
        if (requisicao.method === 'POST' && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const nome = dados.nome;
            const localizacao = dados.localizacao;
            const funcao = dados.funcao;

            if (nome && localizacao) {
                const departamento = new Departamento(0, nome, localizacao, funcao);
                departamento.gravar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "codigoGerado": departamento.codigo,
                        "mensagem": "Departamento incluído com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao registrar o departamento: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o nome e a localização do departamento!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método POST para cadastrar um departamento!"
            });
        }
    }

    
    atualizar(requisicao, resposta) {
        resposta.type('application/json');
        if ((requisicao.method === 'PUT' || requisicao.method === 'PATCH') && requisicao.is('application/json')) {
            const dados = requisicao.body;
            const codigo = dados.codigo;
            const nome = dados.nome;
            const funcao = dados.funcao;
            const localizacao = dados.localizacao;

            if (codigo && nome && localizacao) {
                const departamento = new Departamento(codigo, nome, localizacao, funcao);
                departamento.atualizar().then(() => {
                    resposta.status(200).json({
                        "status": true,
                        "mensagem": "Departamento atualizado com sucesso!"
                    });
                }).catch((erro) => {
                    resposta.status(500).json({
                        "status": false,
                        "mensagem": "Erro ao atualizar o departamento: " + erro.message
                    });
                });
            } else {
                resposta.status(400).json({
                    "status": false,
                    "mensagem": "Por favor, informe o código, o nome e a localização do departamento!"
                });
            }
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize os métodos PUT ou PATCH para atualizar um departamento!"
            });
        }
    }

    
    excluir(requisicao, resposta) {
        resposta.type('application/json');
        const codigo = requisicao.params.codigo; 
        if (codigo) {
          const departamento = new Departamento(codigo);
          departamento.excluir().then(() => {
            resposta.status(200).json({
              status: true,
              mensagem: 'Departamento excluído com sucesso!',
            });
          }).catch((erro) => {
            resposta.status(500).json({
              status: false,
              mensagem: 'Erro ao excluir o departamento: ' + erro.message,
            });
          });
        } else {
          resposta.status(400).json({
            status: false,
            mensagem: 'Por favor, informe o código do departamento!',
          });
        }
      }
    
    consultar(requisicao, resposta) {
        resposta.type('application/json');
        let termo = requisicao.params.termo;
        if (!termo) {
            termo = "";
        }
        if (requisicao.method === "GET") {
            const departamento = new Departamento();
            departamento.consultar(termo).then((listaDepartamentos) => {
                resposta.json({
                    status: true,
                    listaDepartamentos
                });
            }).catch((erro) => {
                resposta.json({
                    status: false,
                    mensagem: "Não foi possível obter os departamentos: " + erro.message
                });
            });
        } else {
            resposta.status(400).json({
                "status": false,
                "mensagem": "Por favor, utilize o método GET para consultar departamentos!"
            });
        }
    }
}
