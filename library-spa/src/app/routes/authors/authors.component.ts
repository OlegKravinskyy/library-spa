import { Component } from '@angular/core';
import { Author } from '../../services/author-interface';
import { Router } from '@angular/router';
import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css',
})
export class AuthorsComponent {
  AuthorList!: Array<Author>;
  deleteError!: string;
  deleteId!: number;
  isDeleting = false;

  constructor(public router: Router, public appDataService: AppDataService) {
    appDataService.getAuthors().subscribe((data) => (this.AuthorList = data));
  }

  createAuthor(): void {
    this.router.navigate(['/detail', 0, 'create']);
  }

  showAuthorDetail(id: number) {
    this.router.navigate(['/detail', id, 'detail']);
  }

  editAuthor(id: number): void {
    this.router.navigate(['/detail', id, 'edit']);
  }

  deleteAuthorQuestion(id: number): void {
    this.deleteError = '';
    this.deleteId = id;
  }

  cancelDelete(): void {
    this.isDeleting = false;
    this.deleteId = 0;
  }

  deleteAuthor(id: number): void {
    this.isDeleting = true;
    this.appDataService.deleteAuthor(id).subscribe(
      (s) => this.cancelDelete(),
      (error) => {
        this.deleteError = error;
        this.isDeleting = false;
      }
    );
  }
}

export class MaintComponent {
  AuthorList!: Array<Author>;
  deleteError!: string;
  deleteId!: number;
  isDeleting = false;

  constructor(public router: Router, public appDataService: AppDataService) {
    appDataService.getAuthors().subscribe((data) => (this.AuthorList = data));
  }
}
