export type ProjectImage = {
  src: string;
  alt: string;
};

export type ProjectDetail = {
  label: string;
  value: string;
};

export type Project = {
  id: string;
  slug: string;
  number: string;
  title: string;
  summary: string;
  description: string;
  details: readonly ProjectDetail[];
  images: readonly ProjectImage[];
};
