  // Atualiza o gráfico de evolução da turma
  async atualizarGraficoEvolucao() {
    // Este é um exemplo simplificado. Em uma implementação completa,
    // você buscaria médias históricas do banco de dados.
    const mediasHistoricas = [0, 0, 0, 0];
    
    // Atualizar o atual período com a média atual
    const periodoIndex = parseInt(this.periodoAtual) - 1;
    
    if (periodoIndex >= 0 && periodoIndex < 4) {
      const medias = this.alunos.map(aluno => this.calcularMediaAluno(aluno.id)).filter(media => media !== null);
      
      if (medias.length > 0) {
        const mediaAtual = medias.reduce((a, b) => a + b, 0) / medias.length;
        mediasHistoricas[periodoIndex] = mediaAtual;
      }
    }
    
    chartManager.atualizarGraficoEvolucao(mediasHistoricas);
  }
}

// Iniciar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
  const app = new DiarioApp();
});
