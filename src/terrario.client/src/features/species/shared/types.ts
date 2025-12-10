// Types for Species feature

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  displayOrder: number;
}

export interface Species {
  id: string;
  commonName: string;
  scientificName?: string;
  categoryId: string;
  categoryName: string;
  description?: string;
  imageUrl?: string;
  careLevel?: string;
  adultSizeCm?: number;
  lifespanYears?: number;
}

export interface GetSpeciesResponse {
  species: Species[];
  totalCount: number;
}

export interface GetCategoriesResponse {
  categories: Category[];
}
