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
        hoverBackgroundColor: data.map((d) => d.color || '#7D8E74'),
        borderRadius: 6,
        borderSkipped: false, // 막대 양끝 모두 둥글게
        barThickness: 24,
        maxBarThickness: 30,
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
        backgroundColor: '#2F3A2C', // 어두운 sage 배경 + 흰 글씨
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        titleFont: { family: "'Noto Sans KR', sans-serif", size: 12 },
        bodyFont: {
          family: "'Noto Sans KR', sans-serif",
          size: 13,
          weight: '600',
        },
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
        border: { display: false }, // 축 선 제거 — 그리드만 연하게
        ticks: {
          callback: (v) => (formatValue ? formatValue(v) : v),
          color: '#9CA3A0',
          font: { family: "'Noto Sans KR', sans-serif", size: 11 },
          padding: 8,
        },
        grid: { color: '#EEF1EC' },
      },
      y: {
        border: { display: false },
        ticks: {
          color: '#374151',
          font: { family: "'Noto Sans KR', sans-serif", size: 12, weight: '500' },
        },
        grid: { display: false },
      },
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
