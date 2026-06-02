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

export function HorizontalBarChart({ title, data, formatValue, action }) {
  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color || '#A8B89F'),
        borderRadius: 4,
        barThickness: 22,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const main = formatValue
              ? formatValue(ctx.parsed.x)
              : ctx.parsed.x.toLocaleString();
            const sub = data[ctx.dataIndex]?.subValue;
            return sub ? `${main} (${sub})` : main;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { callback: (v) => (formatValue ? formatValue(v) : v) },
        grid: { color: '#f0f0f0' },
      },
      y: { grid: { display: false } },
    },
  };

  return (
    <Section title={title} action={action}>
      <Card padded>
        <Wrap $h={Math.max(160, data.length * 46)}>
          <Bar data={chartData} options={options} />
        </Wrap>
      </Card>
    </Section>
  );
}

const Wrap = styled.div`
  height: ${({ $h }) => $h}px;
`;
