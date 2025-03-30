// Classe para gerenciar gráficos
class ChartManager {
  constructor() {
    this.notasChart = null;
    this.evolucaoChart = null;
  }

  // Inicializa os gráficos
  init() {
    this.criarGraficoNotas();
    this.criarGraficoEvolucao();
  }

  // Cria o gráfico de distribuição de notas
  criarGraficoNotas() {
    const ctx = document.getElementById('notas-chart').getContext('2d');
    
    this.notasChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['0-2', '2-4', '4-6', '6-8', '8-10'],
        datasets: [{
          label: 'Quantidade de alunos',
          data: [0, 0, 0, 0, 0],
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(255, 159, 64, 0.5)',
            'rgba(255, 205, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(54, 162, 235, 0.5)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Distribuição de Notas'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });
  }

  // Cria o gráfico de evolução da turma
  criarGraficoEvolucao() {
    const ctx = document.getElementById('evolucao-chart').getContext('2d');
    
    this.evolucaoChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'],
        datasets: [{
          label: 'Média da Turma',
          data: [0, 0, 0, 0],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Evolução da Média'
          }
        },
        scales: {
          y: {
            min: 0,
            max: 10
          }
        }
      }
    });
  }

  // Atualiza o gráfico de distribuição com dados reais
  atualizarGraficoNotas(notas) {
    // Calcula distribuição
    const faixas = [0, 0, 0, 0, 0]; // 0-2, 2-4, 4-6, 6-8, 8-10
    
    notas.forEach(nota => {
      if (nota >= 0 && nota < 2) faixas[0]++;
      else if (nota >= 2 && nota < 4) faixas[1]++;
      else if (nota >= 4 && nota < 6) faixas[2]++;
      else if (nota >= 6 && nota < 8) faixas[3]++;
      else if (nota >= 8 && nota <= 10) faixas[4]++;
    });
    
    this.notasChart.data.datasets[0].data = faixas;
    this.notasChart.update();
  }

  // Atualiza o gráfico de evolução com dados reais
  atualizarGraficoEvolucao(medias) {
    this.evolucaoChart.data.datasets[0].data = medias;
    this.evolucaoChart.update();
  }
}

// Instância global do gerenciador de gráficos
const chartManager = new ChartManager();
