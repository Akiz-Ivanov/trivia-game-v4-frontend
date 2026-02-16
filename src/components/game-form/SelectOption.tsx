import { SelectItem, SelectSeparator } from "@/components/ui/select";

type SelectOptionProps = {
  value: string;
  children: string;
  isLast?: boolean;
};

const SelectOption = ({
  value,
  children,
  isLast,
}: SelectOptionProps): React.JSX.Element => {
  return (
    <>
      <SelectItem
        key={value}
        value={value}
        className="w-full cursor-pointer text-shadow-[1px_1px_2px_#000] hover:text-shadow-[2px_2px_4px_#000]"
      >
        {children}
      </SelectItem>
      {!isLast && <SelectSeparator />}
    </>
  );
};

export default SelectOption;
