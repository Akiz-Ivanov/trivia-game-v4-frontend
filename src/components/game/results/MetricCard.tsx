type MetricCardProps = {
  value: string | number;
  label: string;
};

const MetricCard = ({ value, label }: MetricCardProps) => (
  <div>
    <div className="text-3xl font-bold text-foreground">
      {typeof value === "number" ? value.toLocaleString() : value}
    </div>
    <div className="text-sm text-muted-foreground">{label}</div>
  </div>
);

export default MetricCard;
