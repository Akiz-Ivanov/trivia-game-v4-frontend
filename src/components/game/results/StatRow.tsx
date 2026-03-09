type StatRowProps = {
  label: string;
  value: string | number;
  valuePrefix?: string;
  bold?: boolean;
};

const StatRow = ({
  label,
  value,
  valuePrefix = "",
  bold = false,
}: StatRowProps) => (
  <div className="flex justify-between items-center">
    <dt
      className={bold ? "text-foreground font-bold" : "text-muted-foreground"}
    >
      {label}
    </dt>
    <dd
      className={
        bold
          ? "text-foreground font-bold text-xl"
          : "text-foreground font-semibold"
      }
    >
      {valuePrefix}
      {typeof value === "number" ? value.toLocaleString() : value}
    </dd>
  </div>
);

export default StatRow;
