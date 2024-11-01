import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertAmountToMilliunits = (amount: number) => {
  return Math.round(amount * 1000);
};

export const convertAmountFromMilliunits = (amount: number) => {
  const convertedAmount = amount / 1000;
  return convertedAmount;
};

export const formatCurrency = (value: number) => {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
};
