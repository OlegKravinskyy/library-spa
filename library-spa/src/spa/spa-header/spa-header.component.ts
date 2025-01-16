import { Component, OnInit } from '@angular/core';
import { ScreenService } from '../services/screen.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'spa-header',
  templateUrl: './spa-header.component.html',
  styleUrl: './spa-header.component.css',
})
export class SpaHeaderComponent implements OnInit {
  searchQuery: string = '';
  searchResults: { name: string; author: string }[] = [];

  constructor(
    private screenService: ScreenService,
    public menuService: MenuService
  ) {}

  get isLargeScreen(): boolean {
    return this.screenService.isLarge();
  }

  ngOnInit(): void {
    // this.screenService.checkScreenSize();
  }

  searchBooks(): void {
    const authorsCollection = localStorage.getItem('AuthorsCollection');
    if (!authorsCollection) {
      this.searchResults = [];
      return;
    }

    const authors = JSON.parse(authorsCollection);
    const results: { name: string; author: string }[] = [];

    authors.forEach((author: any) => {
      if (author.books && Array.isArray(author.books)) {
        author.books.forEach((book: any) => {
          if (
            book.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          ) {
            results.push({
              name: book.name,
              author: `${author.firstname} ${author.surname}`,
            });
          }
        });
      }
    });

    this.searchResults = results;
  }
}
