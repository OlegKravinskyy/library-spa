import { Injectable } from '@angular/core';
import { Author } from './author-interface';
import { Observable, of, throwError } from 'rxjs';
import { delay, map, catchError } from 'rxjs';

@Injectable()
export class AppDataService {
  private localStorageKey = 'AuthorsCollection';

  constructor() {
    // Инициализация данных из localStorage
    if (!localStorage.getItem(this.localStorageKey)) {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify([
          {
            id: 1,
            firstname: 'Taras',
            surname: 'Shevchenko',
            patronymic: 'Grigorovich',
            dateOfBurth: 1755,
            books: [
              {
                id: 1,
                name: 'Kobzar',
                pages: 200,
                genres: 'poerty',
              },
            ],
          },
          {
            id: 2,
            firstname: 'Wiliam',
            surname: 'Shakespeare',
            patronymic: '',
            dateOfBurth: 1695,
          },
        ])
      );
    }
  }

  // getAuthors(): Observable<Author[]> {
  //   return of(this.AuthorsCollection);
  // }

  private getAuthorsFromStorage(): Author[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  // getAuthor(id: number): Observable<Author> {
  //   const author = this.AuthorsCollection.find((item) => item.id === id);
  //   if (!author) {
  //     throw new Error(`Author with id ${id} not found`);
  //   }
  //   return of(author);
  // }

  // deleteAuthor(id: number): Observable<any> {
  //   return of({}).pipe(
  //     delay(2000),
  //     map(() =>
  //       this.AuthorsCollection.splice(
  //         this.AuthorsCollection.findIndex((item) => item.id === id),
  //         1
  //       )
  //     )
  //   );
  // }

  // createAuthor(newAuthor: Author): Observable<any> {
  //   let id = 0;
  //   this.AuthorsCollection.forEach((item) => {
  //     if (item.id >= id) {
  //       id = item.id + 1;
  //     }
  //   });
  //   newAuthor.id = id;
  //   this.AuthorsCollection.push(newAuthor);

  //   return of(newAuthor);
  // }

  // updateAuthor(AuthorForUpdating: Author): Observable<any> {
  //   const author = this.AuthorsCollection.find(
  //     (item) => item.id === AuthorForUpdating.id
  //   );
  //   Object.assign(author!, AuthorForUpdating);
  //   return of(author).pipe(delay(1200));
  // }

  private saveAuthorsToStorage(authors: Author[]): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(authors));
  }

  getAuthors(): Observable<Author[]> {
    const authors = this.getAuthorsFromStorage();
    return of(authors);
  }

  getAuthor(id: number): Observable<Author | null> {
    const authors = this.getAuthorsFromStorage();
    const author = authors.find((item) => item.id === id) || null;
    return of(author);
  }

  deleteAuthor(id: number): Observable<boolean> {
    const authors = this.getAuthorsFromStorage();
    const index = authors.findIndex((item) => item.id === id);
    if (index === -1) return of(false);

    authors.splice(index, 1);
    this.saveAuthorsToStorage(authors);
    return of(true);
  }

  createAuthor(newAuthor: Author): Observable<Author> {
    const authors = this.getAuthorsFromStorage();
    const newId =
      authors.length > 0 ? Math.max(...authors.map((a) => a.id)) + 1 : 1;
    newAuthor.id = newId;

    authors.push(newAuthor);
    this.saveAuthorsToStorage(authors);
    return of(newAuthor);
  }

  updateAuthor(updatedAuthor: Author): Observable<Author | null> {
    const authors = this.getAuthorsFromStorage();
    const index = authors.findIndex((item) => item.id === updatedAuthor.id);

    if (index === -1) return of(null);

    authors[index] = updatedAuthor;
    this.saveAuthorsToStorage(authors);
    return of(updatedAuthor);
  }
}
