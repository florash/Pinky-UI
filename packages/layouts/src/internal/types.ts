import type { ReactNode } from "react";

export type CollectionItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
};
