import { BarProps } from 'recharts';

export const CustomBar = (props: BarProps & { accent: string }) => {
  const { x, y, width, height, fill, accent } = props;
  return (
    <>
      <rect x={x} y={y} width={width} height={height} fill={fill} />
      {height && height > 0 && <rect x={x} y={y} width={width} height={2} fill={accent} />}
    </>
  );
};
