import { Component, OnInit } from '@angular/core';
import { FieldInput } from '../../../spa/dynamicForms/field-interface';
import { Author } from '../../services/author-interface';
import { AppDataService } from '../../services/app-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../../services/author-interface';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {
  author!: Author;
  authorDefinitionInput: Array<FieldInput> = [
    {
      key: 'id',
      type: 'number',
      isId: true,
      label: 'Id',
      required: true,
    },
    {
      key: 'surname',
      type: 'string',
      isId: false,
      label: 'Surname',
      required: true,
    },
    {
      key: 'firstname',
      type: 'string',
      isId: false,
      label: 'Firstname',
      required: true,
    },
    {
      key: 'patronymic',
      type: 'string',
      isId: false,
      label: 'Patronymic',
      required: false,
    },
    {
      key: 'date of burth',
      type: 'number',
      isId: false,
      label: 'Date of burth',
      required: true,
    },
    {
      key: 'books',
      type: 'Book[]',
      isId: false,
      label: 'Books',
      required: true,
    },
  ];

  operation!: string; // edit, read, create
  errorMessage!: string;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public appDataService: AppDataService
  ) {}

  ngOnInit(): void {
    this.operation = this.route.snapshot.params['operation'];

    if (this.operation === 'create') {
      this.author = {
        id: 0,
        surname: '',
        firstname: '',
        patronymic: '',
        dateOfBurth: 0,
        books: [],
      };
    } else {
      const id = Number(this.route.snapshot.params['id']);
      if (isNaN(id)) {
        this.errorMessage = 'Invalid author ID';
        return;
      }

      this.appDataService.getAuthor(id).subscribe(
        (author: Author | null) => {
          if (author) {
            this.author = author;
          } else {
            console.error('Author not found');
          }
        },
        (error) => (this.errorMessage = error.message)
      );
    }
  }

  createAuthor(author: Author) {
    author.id = 0;
    this.errorMessage = '';
    this.appDataService.createAuthor(author).subscribe(
      (s) => this.router.navigate(['/author']),
      (error) => (this.errorMessage = 'Error creating car')
    );
  }

  updateAuthor(author: Author) {
    this.errorMessage = '';
    this.appDataService.updateAuthor(author).subscribe(
      (s) => this.router.navigate(['/detail']),
      (error) => (this.errorMessage = 'Error updating car')
    );
  }
}
