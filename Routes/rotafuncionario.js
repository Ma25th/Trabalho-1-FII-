import { Router } from "express";
import FuncionarioCtrl from "../Controller/funcionarioCtrl.js"; 

const funcionarioCtrl = new FuncionarioCtrl();
const rotaFuncionario = new Router();


rotaFuncionario
    .get('/', funcionarioCtrl.consultar)
    .get('/:termo', funcionarioCtrl.consultar)
    .post('/', funcionarioCtrl.gravar)
    .patch('/', funcionarioCtrl.atualizar)
    .put('/:codigo', funcionarioCtrl.atualizar)  
    .delete('/:codigo', funcionarioCtrl.excluir); 

export default rotaFuncionario;
