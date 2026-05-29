export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
};
