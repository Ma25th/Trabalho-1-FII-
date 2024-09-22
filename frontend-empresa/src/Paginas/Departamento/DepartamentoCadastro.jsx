import React, { useState, useEffect } from 'react';
import { Button, Col, Form, Container, Row, Alert, ListGroup, InputGroup, FormControl, Modal } from 'react-bootstrap';
import DepartamentoService from '../../Services/DepartamentoService';

function DepartamentoCadastro() {
  const [departamentos, setDepartamentos] = useState([]);
  const [nome, setNome] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [funcao, setFuncao] = useState('');
  const [editando, setEditando] = useState(false);
  const [codigoEditando, setCodigoEditando] = useState(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mensagemAlerta, setMensagemAlerta] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [codigoParaExcluir, setCodigoParaExcluir] = useState(null);
  const [termoBusca, setTermoBusca] = useState(''); 

  useEffect(() => {
    carregarDepartamentos();
  }, []);

  const carregarDepartamentos = async () => {
    const dados = await DepartamentoService.listarTodos();
    setDepartamentos(Array.isArray(dados) ? dados : []);
  };

  
  const ordenarDepartamentos = (lista) => {
    return lista.sort((a, b) => a.nome.localeCompare(b.nome));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!nome || !localizacao || !funcao) {
      setMensagemAlerta('Por favor, preencha todos os campos!');
      setMostrarAlerta(true);
      return;
    }
  
    if (editando) {
      try {
        await DepartamentoService.atualizar(codigoEditando, { codigo: codigoEditando, nome, localizacao, funcao }); 
        setMensagemAlerta('Departamento atualizado com sucesso!');
      } catch (error) {
        setMensagemAlerta(`Erro ao atualizar o departamento de código ${codigoEditando}: ${error.message}`);
      }
    } else {
      try {
        await DepartamentoService.gravar({ nome, localizacao, funcao });
        setMensagemAlerta('Departamento cadastrado com sucesso!');
      } catch (error) {
        setMensagemAlerta(`Erro ao cadastrar o departamento: ${error.message}`);
      }
    }
  
    setMostrarAlerta(true);
    setNome('');
    setLocalizacao('');
    setFuncao('');
    setEditando(false);
    setCodigoEditando(null);
    carregarDepartamentos();
  };
  const handleEditar = (departamento) => {
    setNome(departamento.nome);
    setLocalizacao(departamento.localizacao);
    setFuncao(departamento.funcao);
    setCodigoEditando(departamento.codigo);  
    setEditando(true);
  };

  const handleConfirmarExcluir = (codigo) => {
    setCodigoParaExcluir(codigo);
    setShowModal(true);
  };

  const handleExcluir = async () => {
    await DepartamentoService.excluir(codigoParaExcluir);
    setMensagemAlerta('Departamento excluído com sucesso!');
    setMostrarAlerta(true);
    setShowModal(false);
    carregarDepartamentos();
  };

  
  const departamentosFiltrados = ordenarDepartamentos(
    departamentos.filter((departamento) =>
      departamento.nome.toLowerCase().includes(termoBusca.toLowerCase())
    )
  );

  return (
    <Container className="mt-5">
      <h1>Cadastro de Departamento</h1>

      {mostrarAlerta && (
        <Alert variant="success" onClose={() => setMostrarAlerta(false)} dismissible>
          {mensagemAlerta}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col>
            <Form.Group controlId="nomeDepartamento">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome do departamento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="localizacaoDepartamento">
              <Form.Label>Localização</Form.Label>
              <Form.Control
                type="text"
                placeholder="Localização"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="funcaoDepartamento" className="mb-3">
          <Form.Label>Função</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Função do departamento"
            value={funcao}
            onChange={(e) => setFuncao(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="primary">
          {editando ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </Form>

      <h2 className="mt-5">Lista de Departamentos</h2>

      <InputGroup className="mb-3">
        <FormControl
          placeholder="Buscar departamentos"
          value={termoBusca} 
          onChange={(e) => setTermoBusca(e.target.value)} 
        />
      </InputGroup>

      {departamentosFiltrados.length > 0 ? (
        <ListGroup>
          {departamentosFiltrados.map((departamento) => (
            <ListGroup.Item key={departamento.codigo}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{departamento.nome}</strong> - {departamento.localizacao} - {departamento.funcao}
                </div>
                <div>
                  <Button variant="warning" className="me-2" onClick={() => handleEditar(departamento)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleConfirmarExcluir(departamento.codigo)}>
                    Excluir
                  </Button>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p>Nenhum departamento encontrado.</p>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>Tem certeza que deseja excluir este departamento?</Modal.Body>
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

export default DepartamentoCadastro;
