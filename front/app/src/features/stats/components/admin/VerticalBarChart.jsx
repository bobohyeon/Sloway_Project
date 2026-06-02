import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js';
import { Card, Section } from '../../../pay_shared/components';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export function VerticalBarChart({ title, data, formatValue, action }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) =>
          d.highlight ? '#A8B89F' : d.color || '#CDD8C6'
        ),
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) =>
            formatValue
              ? formatValue(ctx.parsed.y)
              : ctx.parsed.y.toLocaleString(),
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (v) => (formatValue ? formatValue(v) : v) },
        grid: { color: '#f0f0f0' },
      },
      x: { grid: { display: false } },
    },
  };

  return (
    <Section title={title} action={action}>
      <Card padded>
        <Wrap>
          <Bar data={chartData} options={options} />
        </Wrap>
      </Card>
    </Section>
  );
}

const Wrap = styled.div`
  height: 280px;
`;
