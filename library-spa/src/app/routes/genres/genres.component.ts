import { Component } from '@angular/core';

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.css'],
})
export class GenresComponent {
  private localStorageKey = 'GenresList';
  genresList: string[] = this.getGenresFromStorage(); // Initialize from localStorage

  private getGenresFromStorage(): string[] {
    const data = localStorage.getItem(this.localStorageKey);
    return data ? JSON.parse(data) : [];
  }

  private saveGenresToStorage(): void {
    localStorage.setItem(this.localStorageKey, JSON.stringify(this.genresList));
  }

  addGenre(): void {
    const newGenre: string | null = prompt('Enter genre name:');
    if (newGenre && !this.genresList.includes(newGenre)) {
      this.genresList.push(newGenre);
      this.saveGenresToStorage();
    }
  }

  deleteGenre(index: number): void {
    this.genresList.splice(index, 1);
    this.saveGenresToStorage();
  }
}
