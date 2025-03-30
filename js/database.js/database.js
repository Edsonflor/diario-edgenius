// Referência ao Firestore
const db = firebase.firestore();

// Classe para gerenciar os dados do diário
class DiarioDatabase {
  // Obtém lista de disciplinas
  async getDisciplinas() {
    try {
      const snapshot = await db.collection('disciplinas').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao obter disciplinas:", error);
      return [];
    }
  }

  // Obtém lista de turmas
  async getTurmas() {
    try {
      const snapshot = await db.collection('turmas').get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao obter turmas:", error);
      return [];
    }
  }

  // Obtém alunos de uma turma
  async getAlunos(turmaId) {
    try {
      const snapshot = await db.collection('alunos')
        .where('turmaId', '==', turmaId)
        .orderBy('nome')
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao obter alunos:", error);
      return [];
    }
  }

  // Obtém avaliações de uma disciplina/turma/período
  async getAvaliacoes(disciplinaId, turmaId, periodo) {
    try {
      const snapshot = await db.collection('avaliacoes')
        .where('disciplinaId', '==', disciplinaId)
        .where('turmaId', '==', turmaId)
        .where('periodo', '==', periodo)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao obter avaliações:", error);
      return [];
    }
  }

  // Obtém notas dos alunos
  async getNotas(disciplinaId, turmaId, periodo) {
    try {
      const snapshot = await db.collection('notas')
        .where('disciplinaId', '==', disciplinaId)
        .where('turmaId', '==', turmaId)
        .where('periodo', '==', periodo)
        .get();
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Erro ao obter notas:", error);
      return [];
    }
  }

  // Adiciona uma avaliação
  async adicionarAvaliacao(avaliacao) {
    try {
      return await db.collection('avaliacoes').add(avaliacao);
    } catch (error) {
      console.error("Erro ao adicionar avaliação:", error);
      throw error;
    }
  }

  // Salva uma nota
  async salvarNota(nota) {
    try {
      // Verifica se a nota já existe
      const querySnapshot = await db.collection('notas')
        .where('alunoId', '==', nota.alunoId)
        .where('avaliacaoId', '==', nota.avaliacaoId)
        .get();
      
      if (!querySnapshot.empty) {
        // Atualiza nota existente
        const docId = querySnapshot.docs[0].id;
        await db.collection('notas').doc(docId).update({
          valor: nota.valor,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docId;
      } else {
        // Cria nova nota
        const docRef = await db.collection('notas').add({
          ...nota,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return docRef.id;
      }
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      throw error;
    }
  }

  // Popula o banco com dados iniciais (para demonstração)
  async popularDados() {
    // Verificar se já existem dados
    const disciplinas = await this.getDisciplinas();
    if (disciplinas.length > 0) return;

    // Adicionar disciplinas
    const disciplinasData = [
      { nome: 'Filosofia' },
      { nome: 'História' },
      { nome: 'Robótica' },
      { nome: 'Tecnologia' },
      { nome: 'Projeto de Vida' }
    ];
    
    for (const disc of disciplinasData) {
      await db.collection('disciplinas').add(disc);
    }

    // Adicionar turmas
    const turmasData = [
      { nome: '1ª A', ano: '1º Ano EM' },
      { nome: '1º B', ano: '1º Ano EM' },
      { nome: '2ª A', ano: '2º Ano EM' },
      { nome: '3º A', ano: '3º Ano EM' },
      { nome: '9º Ano A', ano: '9º Ano EF' },
      { nome: '9º Ano B', ano: '9º Ano EF' },
      { nome: '8º Ano A', ano: '8º Ano EF' },
      { nome: '8º Ano B', ano: '8º Ano EF' },
      { nome: '6º Ano A', ano: '6º Ano EF' },
      { nome: '6º Ano B', ano: '6º Ano EF' }
    ];
    
    for (const turma of turmasData) {
      await db.collection('turmas').add(turma);
    }
  }
}

// Instância global do gerenciador de banco
const diarioDb = new DiarioDatabase();
