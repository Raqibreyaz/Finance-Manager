"use client";

import { useMemo } from "react";
import { SingleValue } from "react-select";
import CreateableSelect from "react-select/creatable";

interface Props {
  onChange: (value?: string) => void;
  onCreate: (value: string) => void;
  options?: { label: string; value: string }[];
  value?: string | null;
  disabled?: boolean;
  placeholder?: string;
}

export const Select: React.FC<Props> = ({
  disabled,
  onChange,
  onCreate,
  options = [],
  placeholder,
  value,
}) => {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option?.value);
  };

  const formattedValue = useMemo(
    () => options.find((option): boolean => option.value === value),
    [options, value]
  );

  return (
    <CreateableSelect
      placeholder={placeholder}
      className="text-sm h-10"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": { borderColor: "#e2e8f0" },
        }),
      }}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
      isDisabled={disabled }
    />
  );
};
