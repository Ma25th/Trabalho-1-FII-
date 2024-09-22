import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Container, Row, Alert, ListGroup, InputGroup, FormControl, Modal } from 'react-bootstrap';
import FuncionarioService from '../../Services/FuncionarioService';
import DepartamentoService from '../../Services/DepartamentoService'; 

function FuncionarioCadastro() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [departamentos, setDepartamentos] = useState([]); 
  const [nome, setNome] = useState('');
  const [salario, setSalario] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [termoBusca, setTermoBusca] = useState(''); 
  const [codigoEditando, setCodigoEditando] = useState(null); 
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [codigoParaExcluir, setCodigoParaExcluir] = useState(null); 

  
  useEffect(() => {
    carregarFuncionarios();
    carregarDepartamentos();
  }, []);

  const carregarFuncionarios = async () => {
    try {
      const dados = await FuncionarioService.listarTodos(); 
      setFuncionarios(dados);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const carregarDepartamentos = async () => {
    try {
      const dadosDepartamentos = await DepartamentoService.listarTodos();
      setDepartamentos(dadosDepartamentos);
    } catch (error) {
      console.error('Erro ao carregar departamentos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const salarioNumerico = Number(salario);
      if (isNaN(salarioNumerico)) {
        throw new Error('Salário inválido');
      }

      if (codigoEditando) {
        
        await FuncionarioService.atualizar(codigoEditando, { nome, salario: salarioNumerico, departamentoId });
        setMensagemAlerta('Funcionário atualizado com sucesso!');
      } else {
        
        await FuncionarioService.gravar({ nome, salario: salarioNumerico, departamentoId });
        setMensagemAlerta('Funcionário cadastrado com sucesso!');
      }

      setMostrarAlerta(true);
      setNome('');
      setSalario('');
      setDepartamentoId('');
      setCodigoEditando(null); 
      carregarFuncionarios(); 
    } catch (error) {
      setMensagemAlerta('Erro ao salvar o funcionário');
      setMostrarAlerta(true);
    }
  };

  const handleConfirmarExcluir = (codigo) => {
    setCodigoParaExcluir(codigo);
    setShowModal(true);
  };

  const handleExcluir = async () => {
    try {
      await FuncionarioService.excluir(codigoParaExcluir);
      setMensagemAlerta('Funcionário excluído com sucesso!');
      setMostrarAlerta(true);
      setShowModal(false);
      carregarFuncionarios(); 
    } catch (error) {
      setMensagemAlerta('Erro ao excluir o funcionário');
      setMostrarAlerta(true);
    }
  };

  const handleEditar = (funcionario) => {
    setNome(funcionario.nome);
    setSalario(funcionario.salario);
    setDepartamentoId(funcionario.departamentoId);
    setCodigoEditando(funcionario.codigo); 
  };

  const handleBusca = (e) => {
    setTermoBusca(e.target.value);
  };

  const funcionariosFiltrados = funcionarios.filter((funcionario) =>
    funcionario.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <Container className="mt-5">
      <h1>Cadastro de Funcionário</h1>

      {mostrarAlerta && (
        <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
          {mensagemAlerta}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="nomeFuncionario">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do funcionário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="salarioFuncionario">
              <Form.Label>Salário</Form.Label>
              <Form.Control
                type="text"
                placeholder="Salário"
                value={salario}
                onChange={(e) => setSalario(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="departamentoIdFuncionario" className="mb-3">
          <Form.Label>Departamento</Form.Label>
          <Form.Control
            as="select"
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
            required
          >
            <option value="">Selecione um departamento</option>
            {departamentos.map((departamento) => (
              <option key={departamento.codigo} value={departamento.codigo}>
                {departamento.nome}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Button type="submit" variant="primary">
          {codigoEditando ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </Form>

      <h2 className="mt-5">Lista de Funcionários</h2>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar funcionários"
          value={termoBusca}
          onChange={handleBusca}
        />
      </InputGroup>

      {funcionariosFiltrados.length > 0 ? (
        <ListGroup>
          {funcionariosFiltrados.map((funcionario) => (
            <ListGroup.Item key={funcionario.codigo}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{funcionario.nome}</strong> - {funcionario.salario} - Departamento: {funcionario.departamentoId}
                </div>
                <div>
                  <Button variant="warning" className="me-2" onClick={() => handleEditar(funcionario)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleConfirmarExcluir(funcionario.codigo)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Nenhum funcionário encontrado.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este funcionário?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleExcluir}>
            Excluir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default FuncionarioCadastro;
