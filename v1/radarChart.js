// radarChart.js
let radarChart;
const skillStates = {};  // skillId: { level: 0, category: 'Design' }

export function initRadarChart(categories) {
  const ctx = document.getElementById('radarChart').getContext('2d');

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: categories,
      datasets: [{
        label: 'Skill Level by Category',
        data: [],
        backgroundColor: 'rgba(100, 150, 250, 0.2)',
        borderColor: 'rgba(100, 150, 250, 1)',
        pointBackgroundColor: 'rgba(100, 150, 250, 1)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 2,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

export function registerSkill(id, category) {
  skillStates[id] = { level: 0, category };
}

export function cycleSkillLevel(skillEl) {
  const id = skillEl.id;
  const currentClass = [...skillEl.classList].find(cls => cls.startsWith('level-'));
  let level = 0;

  if (currentClass) {
    level = parseInt(currentClass.split('-')[1], 10);
    skillEl.classList.remove(currentClass);
  }

  const nextLevel = (level + 1) % 4;
  skillEl.classList.add(`level-${nextLevel}`);

  if (skillStates[id]) {
    skillStates[id].level = nextLevel;
  }

  updateRadarChart();
}

function updateRadarChart() {
  const categoryScores = {};

  for (const [id, { level, category }] of Object.entries(skillStates)) {
    if (!categoryScores[category]) categoryScores[category] = [];
    categoryScores[category].push(level);
  }

  const categories = radarChart.data.labels;
  const scores = categories.map(cat => {
    const levels = categoryScores[cat] || [];
    return levels.length ? levels.reduce((a, b) => a + b, 0) / levels.length : 0;
  });

  radarChart.data.datasets[0].data = scores;
  radarChart.update();
}
