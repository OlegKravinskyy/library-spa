export interface Book {
  id: number;
  name: string;
  pages: number;
  genres: string;
}

export interface Author {
  id: number;
  firstname: string;
  surname: string;
  patronymic?: string;
  dateOfBurth: number;
  books?: Book[];
}
