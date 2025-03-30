# Código para o arquivo 7: js/ai-assistant.js

Copie o seguinte código e cole no arquivo `ai-assistant.js` que você criou na pasta js:

```javascript
// Classe para o assistente de inteligência artificial
class AIAssistant {
  constructor() {
    this.insights = [];
    this.assistenteElement = document.getElementById('assistente-ia');
  }

  // Analisa os dados e gera insights
  analisarDados(medias, alunos, avaliacoes) {
    this.insights = [];
    
    if (!medias || medias.length === 0) return;
    
    // Análise básica das médias
    const mediaTurma = medias.reduce((a, b) => a + b, 0) / medias.length;
    const alunosAbaixo = medias.filter(m => m < 6).length;
    const percentualAbaixo = (alunosAbaixo / medias.length) * 100;
    const desvPadrao = this.calcularDesvioPadrao(medias);
    
    // Insight sobre desempenho geral
    if (mediaTurma >= 8) {
      this.insights.push({
        tipo: 'sucesso',
        mensagem: 'A turma demonstra excelente desempenho com média acima de 8.0.'
      });
    } else if (mediaTurma >= 6) {
      this.insights.push({
        tipo: 'info',
        mensagem: 'A turma está com desempenho adequado, mas há espaço para melhorias.'
      });
    } else {
      this.insights.push({
        tipo: 'alerta',
        mensagem: 'A turma está com desempenho abaixo do esperado. Considere ações de recuperação.'
      });
    }
    
    // Insight sobre alunos abaixo da média
    if (percentualAbaixo > 30) {
      this.insights.push({
        tipo: 'alerta',
        mensagem: `${alunosAbaixo} alunos (${percentualAbaixo.toFixed(1)}%) estão abaixo da média. Considere revisar o conteúdo.`
      });
    } else if (percentualAbaixo > 0) {
      this.insights.push({
        tipo: 'info',
        mensagem: `${alunosAbaixo} alunos estão abaixo da média e podem precisar de atenção individual.`
      });
    } else {
      this.insights.push({
        tipo: 'sucesso',
        mensagem: 'Todos os alunos estão acima da média! Excelente trabalho.'
      });
    }
    
    // Insight sobre heterogeneidade da turma
    if (desvPadrao > 2) {
      this.insights.push({
        tipo: 'alerta',
        mensagem: 'A turma apresenta grande variação de desempenho. Considere estratégias diferenciadas.'
      });
    } else if (desvPadrao < 1) {
      this.insights.push({
        tipo: 'info',
        mensagem: 'A turma apresenta desempenho muito homogêneo.'
      });
    }
    
    // Exibir insights na interface
    this.exibirInsightsNaInterface();
  }
  
  // Calcula o desvio padrão de um conjunto de valores
  calcularDesvioPadrao(valores) {
    const media = valores.reduce((a, b) => a + b, 0) / valores.length;
    const somaDifQuadrado = valores.reduce((soma, valor) => soma + Math.pow(valor - media, 2), 0);
    return Math.sqrt(somaDifQuadrado / valores.length);
  }
  
  // Exibe os insights na interface
  exibirInsightsNaInterface() {
    // Verifica se o elemento de destino existe
    if (!this.assistenteElement) return;
    
    let html = '<div class="card mb-4"><div class="card-header"><h5><i class="bi bi-robot"></i> Assistente IA</h5></div>';
    html += '<div class="card-body">';
    
    if (this.insights.length > 0) {
      html += '<ul class="list-group">';
      
      this.insights.forEach(insight => {
        let iconClass = 'bi-info-circle text-info';
        
        if (insight.tipo === 'sucesso') {
          iconClass = 'bi-check-circle text-success';
        } else if (insight.tipo === 'alerta') {
          iconClass = 'bi-exclamation-triangle text-warning';
        }
        
        html += `
          <li class="list-group-item d-flex">
            <i class="bi ${iconClass} me-2"></i>
            <span>${insight.mensagem}</span>
          </li>
        `;
      });
      
      html += '</ul>';
    } else {
      html += '<p class="text-muted">Sem dados suficientes para análise.</p>';
    }
    
    html += '</div></div>';
    
    this.assistenteElement.innerHTML = html;
  }
  
  // Gera recomendações personalizadas
  gerarRecomendacoes(alunos, notas) {
    // Esta funcionalidade poderia ser expandida em uma versão mais completa
    // Para usar modelos de ML via API externa como Hugging Face
    return {
      recuperacao: alunos.filter(a => {
        const notasAluno = notas.filter(n => n.alunoId === a.id);
        const media = notasAluno.reduce((sum, n) => sum + n.valor, 0) / notasAluno.length;
        return media < 6;
      }).map(a => a.nome),
      
      destaque: alunos.filter(a => {
        const notasAluno = notas.filter(n => n.alunoId === a.id);
        const media = notasAluno.reduce((sum, n) => sum + n.valor, 0) / notasAluno.length;
        return media >= 9;
      }).map(a => a.nome)
    };
  }
}

// Instância global do assistente
const aiAssistant = new AIAssistant();
```

Depois de colar o código, salve o arquivo e avise quando estiver pronto para o último arquivo.