// Types for Animals feature


export enum AnimalGender {
  Unknown = 0,
  Male = 1,
  Female = 2,
}

export interface Animal {
  id: string;
  name: string;
  speciesId: string;
  speciesCommonName: string;
  speciesScientificName: string;
  categoryId: string;
  categoryName: string;
  animalListId: string;
  animalListName: string;
  imageUrl?: string;
  gender?: AnimalGender;
  createdAt: string;
}

export interface CreateAnimalRequest {
  name: string;
  speciesId: string;
  animalListId: string;
  imageUrl?: string;
  gender?: AnimalGender;
}

export interface CreateAnimalResponse {
  id: string;
  name: string;
  speciesId: string;
  speciesName: string;
  animalListId: string;
  animalListName: string;
  imageUrl?: string;
  gender?: AnimalGender;
  createdAt: string;
  message: string;
}

export interface UpdateAnimalRequest {
  name: string;
  speciesId: string;
  animalListId: string;
  imageUrl?: string;
  gender?: AnimalGender;
}

export interface UpdateAnimalResponse {
  id: string;
  name: string;
  speciesId: string;
  animalListId: string;
  imageUrl?: string;
  gender?: AnimalGender;
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

export interface GetRecentAnimalsResponse {
  recentAnimals: Animal[];
  totalCount: number;
}

export interface AnimalDetails {
  id: string;
  name: string;
  speciesId: string;
  speciesCommonName: string;
  speciesScientificName: string;
  categoryId: string;
  categoryName: string;
  animalListId: string;
  animalListName: string;
  imageUrl?: string;
  gender?: AnimalGender;
  createdAt: string;
}

export interface GetAnimalDetailsResponse {
  animal: AnimalDetails;
}

export interface UploadAnimalImageResponse {
  animalId: string;
  imageUrl: string;
  message: string;
}

export interface DeleteAnimalImageResponse {
  animalId: string;
  message: string;
}
