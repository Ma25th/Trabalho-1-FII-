import { Router } from "express";
import FuncionarioCtrl from "../Controller/funcionarioCtrl.js";

const funcCtrl = new FuncionarioCtrl();
const rotaFuncionario = new Router();

rotaFuncionario
.get('/', funcCtrl.consultar)
.get('/:termo', funcCtrl.consultar)
.post('/', funcCtrl.gravar)
.patch('/', funcCtrl.atualizar)
.put('/', funcCtrl.atualizar)
.delete('/', funcCtrl.excluir);

export default rotaFuncionario;
