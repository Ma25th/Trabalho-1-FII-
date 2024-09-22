const API_URL = 'http://localhost:3001/funcionario';

class FuncionarioService {
  
  async listarTodos() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

     
      if (!response.ok) {
        console.error('Erro ao listar funcionários:', await response.text());
        throw new Error('Erro ao listar funcionários');
      }

      
      const dados = await response.json();

      
      if (!Array.isArray(dados.listaFuncionarios)) {
        console.error('Resposta inesperada:', dados);
        return [];
      }

      return dados.listaFuncionarios;
    } catch (error) {
      console.error('Erro ao listar funcionários:', error);
      return [];
    }
  }

  
  async gravar(funcionario) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcionario)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || 'Erro ao cadastrar funcionário');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao cadastrar funcionário:', error);
      throw error;
    }
  }

 
  async atualizar(codigo, funcionario) {
    try {
      const response = await fetch(`${API_URL}/${codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(funcionario)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro ao atualizar funcionário:', errorText);
        throw new Error(`Erro ao atualizar o funcionário de código ${codigo}: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar o funcionário de código ${codigo}:`, error);
      throw error;
    }
  }

 
  async excluir(codigo) {
    try {
      
      const response = await fetch(`${API_URL}/${codigo}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Erro ao excluir funcionário de código ${codigo}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao excluir funcionário de código ${codigo}:`, error);
      throw error;
    }
  }
}

const funcionarioService = new FuncionarioService();
export default funcionarioService;
