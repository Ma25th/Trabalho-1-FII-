const API_URL = 'http://localhost:3001/departamento';

class DepartamentoService {
  
  async listarTodos() {
    try {
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
     
      if (!response.ok) {
        console.error('Erro ao listar departamentos:', await response.text()); 
        throw new Error('Erro ao listar departamentos');
      }

      
      const dados = await response.json();
      
     
      if (!Array.isArray(dados.listaDepartamentos)) {
        console.error('Resposta inesperada:', dados);
        return [];
      }
      
      return dados.listaDepartamentos;
    } catch (error) {
      console.error('Erro ao listar departamentos:', error);
      return [];
    }
  }

  
  async gravar(departamento) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(departamento)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao gravar departamento');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao gravar departamento:', error);
      throw error;
    }
  }

  
  async atualizar(codigo, departamento) {
    try {
      const response = await fetch(`${API_URL}/${codigo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(departamento)
      });

      if (!response.ok) {
        
        const errorText = await response.text();
        console.error('Erro ao atualizar departamento:', errorText);
        throw new Error(`Erro ao atualizar o departamento de código ${codigo}: ${errorText}`);
      }

      
      return await response.json();
    } catch (error) {
      console.error(`Erro ao atualizar o departamento de código ${codigo}:`, error);
      throw error;
    }
  }

  
  async excluir(codigo) {
    try {
      const response = await fetch(`${API_URL}/${codigo}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erro ao excluir o departamento de código ${codigo}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Erro ao excluir o departamento de código ${codigo}:`, error);
      throw error;
    }
  }
}

const departamentoService = new DepartamentoService();
export default departamentoService;
