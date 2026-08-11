import type { ReactNode } from "react";

export type SpatialCollectionItem = {
  id: string;
  label: string;
  content: ReactNode;
  meta?: ReactNode;
  disabled?: boolean;
};
