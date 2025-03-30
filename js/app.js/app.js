# Código para o arquivo 8: js/app.js

Copie o seguinte código e cole no arquivo `app.js` que você criou na pasta js:

```javascript
// Classe principal da aplicação
class DiarioApp {
  constructor() {
    this.disciplinaSelect = document.getElementById('disciplina-select');
    this.turmaSelect = document.getElementById('turma-select');
    this.periodoSelect = document.getElementById('periodo-select');
    this.atualizarBtn = document.getElementById('atualizar-btn');
    
    this.disciplinaAtual = null;
    this.turmaAtual = null;
    this.periodoAtual = '1';
    
    this.avaliacoes = [];
    this.alunos = [];
    this.notas = [];
    
    this.init();
  }

  // Inicialização da aplicação
  async init() {
    // Carrega dados iniciais para demonstração
    await diarioDb.popularDados();
    
    // Carrega listas de disciplinas e turmas
    await this.carregarDisciplinas();
    await this.carregarTurmas();
    
    // Inicializa gráficos
    chartManager.init();
    
    // Configura eventos
    this.setupEventListeners();
    
    // Carrega dados iniciais
    this.carregarDados();
  }

  // Configura os event listeners
  setupEventListeners() {
    // Botão de atualizar dados
    this.atualizarBtn.addEventListener('click', () => {
      this.carregarDados();
    });
    
    // Selects para filtros
    this.disciplinaSelect.addEventListener('change', () => {
      this.disciplinaAtual = this.disciplinaSelect.value;
    });
    
    this.turmaSelect.addEventListener('change', () => {
      this.turmaAtual = this.turmaSelect.value;
    });
    
    this.periodoSelect.addEventListener('change', () => {
      this.periodoAtual = this.periodoSelect.value;
    });
    
    // Botão para adicionar avaliação
    const novaAvaliacaoBtn = document.getElementById('nova-avaliacao-btn');
    novaAvaliacaoBtn.addEventListener('click', () => {
      const modal = new bootstrap.Modal(document.getElementById('nova-avaliacao-modal'));
      modal.show();
    });
  }
  
  // Carrega lista de disciplinas do banco de dados
  async carregarDisciplinas() {
    const disciplinas = await diarioDb.getDisciplinas();
    this.disciplinaSelect.innerHTML = '';
    
    disciplinas.forEach(disciplina => {
      const option = document.createElement('option');
      option.value = disciplina.id;
      option.textContent = disciplina.nome;
      this.disciplinaSelect.appendChild(option);
    });
    
    if (disciplinas.length > 0) {
      this.disciplinaAtual = disciplinas[0].id;
    }
  }
  
  // Carrega lista de turmas do banco de dados
  async carregarTurmas() {
    const turmas = await diarioDb.getTurmas();
    this.turmaSelect.innerHTML = '';
    
    turmas.forEach(turma => {
      const option = document.createElement('option');
      option.value = turma.id;
      option.textContent = turma.nome;
      this.turmaSelect.appendChild(option);
    });
    
    if (turmas.length > 0) {
      this.turmaAtual = turmas[0].id;
    }
  }
  
  // Carrega dados principais (alunos, avaliações, notas)
  async carregarDados() {
    if (!this.disciplinaAtual || !this.turmaAtual) {
      alert('Selecione uma disciplina e uma turma');
      return;
    }
    
    try {
      // Carregar alunos da turma
      this.alunos = await diarioDb.getAlunos(this.turmaAtual);
      
      // Carregar avaliações
      this.avaliacoes = await diarioDb.getAvaliacoes(
        this.disciplinaAtual, 
        this.turmaAtual,
        this.periodoAtual
      );
      
      // Carregar notas
      this.notas = await diarioDb.getNotas(
        this.disciplinaAtual,
        this.turmaAtual,
        this.periodoAtual
      );
      
      // Atualizar interface
      this.atualizarTabela();
      this.atualizarEstatisticas();
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Consulte o console para mais detalhes.');
    }
  }
  
  // Atualiza a tabela de avaliações
  atualizarTabela() {
    // Atualizar cabeçalho da tabela
    const tabelaHeader = document.getElementById('avaliacoes-header');
    let headerHTML = `
      <tr>
        <th>ID</th>
        <th>Aluno</th>
    `;
    
    // Adicionar colunas para cada avaliação
    this.avaliacoes.forEach(avaliacao => {
      headerHTML += `
        <th>
          <input type="text" class="form-control form-control-sm avaliacao-nome" 
                 data-id="${avaliacao.id}" value="${avaliacao.nome}">
          <small>Peso: <input type="number" class="form-control form-control-sm mt-1 avaliacao-peso" 
                 data-id="${avaliacao.id}" value="${avaliacao.peso}" min="1" max="10"></small>
        </th>
      `;
    });
    
    // Adicionar coluna de média
    headerHTML += `
        <th>Média</th>
        <th>Ações</th>
      </tr>
    `;
    
    tabelaHeader.innerHTML = headerHTML;
    
    // Atualizar corpo da tabela
    const tabelaBody = document.getElementById('alunos-table-body');
    let bodyHTML = '';
    
    this.alunos.forEach((aluno, index) => {
      bodyHTML += `
        <tr>
          <td>${index + 1}</td>
          <td>${aluno.nome}</td>
      `;
      
      // Adicionar células para cada avaliação
      this.avaliacoes.forEach(avaliacao => {
        const nota = this.notas.find(n => 
          n.alunoId === aluno.id && n.avaliacaoId === avaliacao.id
        );
        
        const notaValor = nota ? nota.valor : '';
        
        bodyHTML += `
          <td>
            <input type="number" class="form-control nota-input" 
                   data-aluno="${aluno.id}" data-avaliacao="${avaliacao.id}"
                   min="0" max="10" step="0.1" value="${notaValor}">
          </td>
        `;
      });
      
      // Calcular e adicionar média
      const media = this.calcularMediaAluno(aluno.id);
      const mediaFormatada = media !== null ? media.toFixed(1) : '-';
      const mediaClass = media !== null ? (media >= 6 ? 'text-success' : 'text-danger') : '';
      
      bodyHTML += `
          <td class="${mediaClass} fw-bold">${mediaFormatada}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary">
              <i class="bi bi-eye"></i>
            </button>
          </td>
        </tr>
      `;
    });
    
    tabelaBody.innerHTML = bodyHTML;
    
    // Adicionar eventos para inputs de notas
    document.querySelectorAll('.nota-input').forEach(input => {
      input.addEventListener('change', async (e) => {
        const alunoId = e.target.dataset.aluno;
        const avaliacaoId = e.target.dataset.avaliacao;
        const valor = parseFloat(e.target.value);
        
        if (isNaN(valor) || valor < 0 || valor > 10) {
          alert('A nota deve ser um número entre 0 e 10');
          return;
        }
        
        try {
          await diarioDb.salvarNota({
            alunoId,
            avaliacaoId,
            disciplinaId: this.disciplinaAtual,
            turmaId: this.turmaAtual,
            periodo: this.periodoAtual,
            valor
          });
          
          // Atualizar notas em memória
          const notaExistente = this.notas.find(n => 
            n.alunoId === alunoId && n.avaliacaoId === avaliacaoId
          );
          
          if (notaExistente) {
            notaExistente.valor = valor;
          } else {
            this.notas.push({
              alunoId,
              avaliacaoId,
              disciplinaId: this.disciplinaAtual,
              turmaId: this.turmaAtual,
              periodo: this.periodoAtual,
              valor
            });
          }
          
          // Atualizar média do aluno
          this.atualizarMediaAluno(alunoId);
          
          // Atualizar estatísticas
          this.atualizarEstatisticas();
          
        } catch (error) {
          console.error('Erro ao salvar nota:', error);
          alert('Erro ao salvar nota');
        }
      });
    });
    
    // Configurar botão para salvar nova avaliação
    const salvarAvaliacaoBtn = document.getElementById('salvar-avaliacao-btn');
    salvarAvaliacaoBtn.addEventListener('click', async () => {
      const nome = document.getElementById('avaliacao-nome').value;
      const peso = parseInt(document.getElementById('avaliacao-peso').value);
      
      if (!nome || isNaN(peso) || peso < 1 || peso > 10) {
        alert('Preencha todos os campos corretamente');
        return;
      }
      
      try {
        const novaAvaliacao = {
          nome,
          peso,
          disciplinaId: this.disciplinaAtual,
          turmaId: this.turmaAtual,
          periodo: this.periodoAtual,
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await diarioDb.adicionarAvaliacao(novaAvaliacao);
        
        // Adicionar à lista em memória
        this.avaliacoes.push({
          id: docRef.id,
          ...novaAvaliacao
        });
        
        // Fechar modal e atualizar tabela
        const modal = bootstrap.Modal.getInstance(document.getElementById('nova-avaliacao-modal'));
        modal.hide();
        
        this.atualizarTabela();
        
      } catch (error) {
        console.error('Erro ao adicionar avaliação:', error);
        alert('Erro ao adicionar avaliação');
      }
    });
  }
  
  // Calcula a média ponderada de um aluno
  calcularMediaAluno(alunoId) {
    const notasAluno = this.notas.filter(n => n.alunoId === alunoId);
    
    if (notasAluno.length === 0) return null;
    
    let somaPonderada = 0;
    let somaPesos = 0;
    
    notasAluno.forEach(nota => {
      const avaliacao = this.avaliacoes.find(a => a.id === nota.avaliacaoId);
      
      if (avaliacao) {
        somaPonderada += nota.valor * avaliacao.peso;
        somaPesos += avaliacao.peso;
      }
    });
    
    if (somaPesos === 0) return null;
    
    return somaPonderada / somaPesos;
  }
  
  // Atualiza a exibição da média de um aluno na tabela
  atualizarMediaAluno(alunoId) {
    const media = this.calcularMediaAluno(alunoId);
    
    if (media === null) return;
    
    const index = this.alunos.findIndex(a => a.id === alunoId);
    
    if (index !== -1) {
      const rows = document.getElementById('alunos-table-body').getElementsByTagName('tr');
      
      if (rows[index]) {
        const mediaCelula = rows[index].cells[rows[index].cells.length - 2];
        mediaCelula.textContent = media.toFixed(1);
        mediaCelula.className = media >= 6 ? 'text-success fw-bold' : 'text-danger fw-bold';
      }
    }
  }
  
  // Atualiza estatísticas e gráficos
  atualizarEstatisticas() {
    // Calcular médias de todos os alunos
    const medias = this.alunos.map(aluno => this.calcularMediaAluno(aluno.id)).filter(media => media !== null);
    
    // Atualizar estatísticas
    const mediaTurma = document.getElementById('media-turma');
    const melhorAluno = document.getElementById('melhor-aluno');
    const melhorNota = document.getElementById('melhor-nota');
    const abaixoMedia = document.getElementById('abaixo-media');
    const totalAlunos = document.getElementById('total-alunos');
    
    // Média da turma
    if (medias.length > 0) {
      const media = medias.reduce((a, b) => a + b, 0) / medias.length;
      mediaTurma.textContent = media.toFixed(1);
    } else {
      mediaTurma.textContent = '-';
    }
    
    // Melhor aluno
    if (medias.length > 0) {
      const melhorMedia = Math.max(...medias);
      const melhorIndex = medias.indexOf(melhorMedia);
      
      if (melhorIndex !== -1) {
        melhorAluno.textContent = this.alunos[melhorIndex].nome;
        melhorNota.textContent = melhorMedia.toFixed(1);
      }
    } else {
      melhorAluno.textContent = '-';
      melhorNota.textContent = '-';
    }
    
    // Alunos abaixo da média
    const abaixo = medias.filter(media => media < 6).length;
    abaixoMedia.textContent = abaixo;
    
    // Total de alunos
    totalAlunos.textContent = this.alunos.length;
    
    // Atualizar gráficos
    chartManager.atualizarGraficoNotas(medias);
    
    // Consultar médias históricas para o gráfico de evolução
    this.atualizarGraficoEvolucao();
    
    // Atualizar assistente de IA
    aiAssistant.analisarDados(medias, this.alunos, this.avaliacoes);
  }
  
  // Atualiza o gráfico de evolução da turma
  async atualizarGraficoEvolucao() {
    // Este é um exemplo simplificado. Em uma implementação completa,
    // você buscaria médias hist