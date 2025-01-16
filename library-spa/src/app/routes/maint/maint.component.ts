import { Component } from '@angular/core';
import { Author } from '../../services/author-interface';
import { Router } from '@angular/router';
import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-maint',
  templateUrl: './maint.component.html',
  styleUrl: './maint.component.css',
})
export class MaintComponent {
  AuthorList!: Array<Author>;
  deleteError!: string;
  deleteId!: number;
  isDeleting = false;

  constructor(public router: Router, public appDataService: AppDataService) {
    appDataService.getAuthors().subscribe((data) => (this.AuthorList = data));
  }

  createAuthor(): void {
    console.log('Created Author');
  }

  showAuthorDetail(id: number) {
    console.log('Show Author');
  }

  editAuthor(id: number): void {
    console.log('Edit Author');
  }

  deleteAuthorQuestion(id: number): void {
    console.log('Question');
  }

  cancelDelete(): void {
    console.log('Canceled!');
  }

  deleteAuthor(id: number): void {
    console.log('Author deleted!');
  }
}
