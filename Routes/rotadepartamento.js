import { Router } from "express";
import DepartamentoCtrl from "../Controller/departamentoCtrl.js";

const depCtrl = new DepartamentoCtrl();
const rotaDepartamento = new Router();

rotaDepartamento
  .get('/', depCtrl.consultar)
  .get('/:termo', depCtrl.consultar)
  .post('/', depCtrl.gravar)
  .patch('/:codigo', depCtrl.atualizar) 
  .put('/:codigo', depCtrl.atualizar)  
  .delete('/:codigo', depCtrl.excluir); 

export default rotaDepartamento;
