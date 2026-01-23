// Types for Animals feature

export interface Animal {
  id: string;
  name: string;
  speciesId: string;
  speciesCommonName: string;
  speciesScientificName: string;
  categoryId: string;
  categoryName: string;
  animalListId: string;
  imageUrl?: string;
  createdAt: string;
}

export interface CreateAnimalRequest {
  name: string;
  speciesId: string;
  animalListId: string;
  imageUrl?: string;
}

export interface CreateAnimalResponse {
  id: string;
  name: string;
  speciesId: string;
  speciesName: string;
  animalListId: string;
  animalListName: string;
  imageUrl?: string;
  createdAt: string;
  message: string;
}

export interface UpdateAnimalRequest {
  name: string;
  speciesId: string;
  animalListId: string;
  imageUrl?: string;
}

export interface UpdateAnimalResponse {
  id: string;
  name: string;
  speciesId: string;
  animalListId: string;
  imageUrl?: string;
  updatedAt: string;
  message: string;
}

export interface GetAnimalsResponse {
  animals: Animal[];
  totalCount: number;
}

export interface DeleteAnimalResponse {
  message: string;
}

export interface RecentAnimal {
  id: string;
  name: string;
  speciesCommonName: string;
  speciesScientificName?: string;
  categoryName: string;
  imageUrl?: string;
  createdAt: string;
  animalListName: string;
  animalListId: string;
}

export interface GetRecentAnimalsResponse {
  recentAnimals: RecentAnimal[];
  totalCount: number;
}
