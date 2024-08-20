import Departamento from "../Model/departamento.js";
import conectar from "./conexao.js";

export default class DepartamentoDAO {

    constructor() {
        this.init();
    }

    async init() {
        try {
            const conexao = await conectar(); 
            const sql = `
                CREATE TABLE IF NOT EXISTS departamentos(
                    dep_codigo INT NOT NULL AUTO_INCREMENT,
                    dep_nome VARCHAR(100) NOT NULL,
                    dep_localizacao VARCHAR(100) NOT NULL,
                    CONSTRAINT pk_departamentos PRIMARY KEY(dep_codigo)
                );
            `;
            await conexao.execute(sql);
            await conexao.release();
        } catch (e) {
            console.log("Não foi possível iniciar o banco de dados: " + e.message);
        }
    }

    async gravar(departamento) {
        if (departamento instanceof Departamento) {
            const sql = "INSERT INTO departamentos(dep_nome, dep_localizacao) VALUES(?, ?)"; 
            const parametros = [departamento.nome, departamento.localizacao];
            const conexao = await conectar(); 
            const retorno = await conexao.execute(sql, parametros); 
            departamento.codigo = retorno[0].insertId;
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async atualizar(departamento) {
        if (departamento instanceof Departamento) {
            const sql = "UPDATE departamentos SET dep_nome = ?, dep_localizacao = ? WHERE dep_codigo = ?"; 
            const parametros = [departamento.nome, departamento.localizacao, departamento.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql, parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async excluir(departamento) {
        if (departamento instanceof Departamento) {
            const sql = "DELETE FROM departamentos WHERE dep_codigo = ?"; 
            const parametros = [departamento.codigo];
            const conexao = await conectar(); 
            await conexao.execute(sql, parametros); 
            global.poolConexoes.releaseConnection(conexao);
        }
    }

    async consultar(parametroConsulta) {
        let sql = '';
        let parametros = [];
        if (!isNaN(parseInt(parametroConsulta))) {
            sql = 'SELECT * FROM departamentos WHERE dep_codigo = ? ORDER BY dep_nome';
            parametros = [parametroConsulta];
        } else {
            if (!parametroConsulta) {
                parametroConsulta = '';
            }
            sql = "SELECT * FROM departamentos WHERE dep_nome LIKE ? ORDER BY dep_nome";
            parametros = ['%' + parametroConsulta + '%'];
        }
        const conexao = await conectar();
        const [registros, campos] = await conexao.execute(sql, parametros);
        let listaDepartamentos = [];
        for (const registro of registros) {
            const departamento = new Departamento(registro.dep_codigo, registro.dep_nome, registro.dep_localizacao);
            listaDepartamentos.push(departamento);
        }
        return listaDepartamentos;
    }
}
