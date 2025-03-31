// Script para configurar automaticamente a turma 9°A
document.addEventListener('DOMContentLoaded', function() {
  // Botão de inicialização
  const setupButton = document.createElement('button');
  setupButton.innerHTML = '<i class="bi bi-magic"></i> Configurar Turma 9°A';
  setupButton.className = 'btn btn-warning position-fixed bottom-0 end-0 m-3';
  setupButton.style.zIndex = '1000';
  document.body.appendChild(setupButton);
  
  setupButton.addEventListener('click', async function() {
    if (!confirm('Isso irá configurar dados de exemplo para o 9°A. Continuar?')) return;
    
    try {
      setupButton.disabled = true;
      setupButton.innerHTML = 'Configurando...';
      
      // Verificar login
      if (!firebase.auth().currentUser) {
        alert('Faça login primeiro!');
        window.location.href = 'login.html';
        return;
      }
      
      await configurarTurma9A();
      
      alert('Configuração concluída! A página será recarregada.');
      location.reload();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao configurar: ' + error.message);
      setupButton.disabled = false;
      setupButton.innerHTML = '<i class="bi bi-magic"></i> Tentar Novamente';
    }
  });
  
  // Função principal de configuração
  async function configurarTurma9A() {
    const db = firebase.firestore();
    
    // 1. Criar disciplinas se não existirem
    const disciplinas = [
      {id: 'historia', nome: 'História'},
      {id: 'projetoVida', nome: 'Projeto de Vida'}
    ];
    
    for (const disc of disciplinas) {
      const docRef = db.collection('disciplinas').doc(disc.id);
      const docSnap = await docRef.get();
      
      if (!docSnap.exists) {
        await docRef.set({nome: disc.nome});
        console.log(`Disciplina ${disc.nome} criada.`);
      }
    }
    
    // 2. Criar turma 9°A
    const turma9ARef = db.collection('turmas').doc('9a');
    const turma9ASnap = await turma9ARef.get();
    
    if (!turma9ASnap.exists) {
      await turma9ARef.set({
        nome: '9º Ano A',
        ano: '9º Ano EF'
      });
      console.log('Turma 9º Ano A criada.');
    }
    
    // 3. Criar alunos exemplo
    const alunos9A = [
      {nome: 'Ana Silva', matricula: '2023001'},
      {nome: 'Bruno Santos', matricula: '2023002'},
      {nome: 'Carla Oliveira', matricula: '2023003'},
      {nome: 'Daniel Souza', matricula: '2023004'},
      {nome: 'Eduarda Lima', matricula: '2023005'},
      {nome: 'Felipe Costa', matricula: '2023006'},
      {nome: 'Gabriela Martins', matricula: '2023007'},
      {nome: 'Henrique Alves', matricula: '2023008'},
      {nome: 'Isabela Ferreira', matricula: '2023009'},
      {nome: 'João Pedro Ribeiro', matricula: '2023010'}
    ];
    
    for (const aluno of alunos9A) {
      // Verificar se já existe pelo nome e turma
      const alunosRef = db.collection('alunos');
      const query = await alunosRef
        .where('nome', '==', aluno.nome)
        .where('turmaId', '==', '9a')
        .get();
      
      if (query.empty) {
        await alunosRef.add({
          ...aluno,
          turmaId: '9a',
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log(`Aluno ${aluno.nome} criado.`);
      }
    }
    
    // 4. Criar avaliações exemplo para História
    const avaliacoesHistoria = [
      {nome: 'Prova 1', peso: 2},
      {nome: 'Trabalho', peso: 1},
      {nome: 'Participação', peso: 1}
    ];
    
    for (const av of avaliacoesHistoria) {
      await db.collection('avaliacoes').add({
        nome: av.nome,
        peso: av.peso,
        disciplinaId: 'historia',
        turmaId: '9a',
        periodo: '1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Avaliação ${av.nome} (História) criada.`);
    }
    
    // 5. Criar avaliações exemplo para Projeto de Vida
    const avaliacoesProjeto = [
      {nome: 'Apresentação', peso: 2},
      {nome: 'Portfólio', peso: 2},
      {nome: 'Autoavaliação', peso: 1}
    ];
    
    for (const av of avaliacoesProjeto) {
      await db.collection('avaliacoes').add({
        nome: av.nome,
        peso: av.peso,
        disciplinaId: 'projetoVida',
        turmaId: '9a',
        periodo: '1',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log(`Avaliação ${av.nome} (Projeto de Vida) criada.`);
    }
    
    console.log('Configuração da turma 9°A concluída com sucesso!');
  }
});
