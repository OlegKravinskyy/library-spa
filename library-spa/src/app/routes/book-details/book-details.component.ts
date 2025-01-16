import {
  Component,
  OnInit,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
} from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface Book {
  id: number;
  name: string;
  pages: number;
  genres: string;
}

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit, OnChanges {
  @Input() vm: any;
  @Input() operation!: string;
  @Input() bookToEdit: Book | null = null;

  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter();

  bookId!: number;
  bookForm!: FormGroup;
  submitted = false;
  editingBook: Book | null = null;
  authorId: number | null = null;
  genresList: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder
  ) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      pages: [null, [Validators.required, Validators.min(1)]],
      genres: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.clearForm();

    this.route.params.subscribe((params) => {
      this.operation = params['operation'];

      if (params['authorId']) {
        this.authorId = +params['authorId'];
      }

      if (params['bookId']) {
        this.bookId = +params['bookId'];
        this.loadBookForEdit(this.bookId);
      }
      if (this.operation === 'edit') {
        if (this.bookToEdit) {
          this.bookForm.patchValue(this.bookToEdit);
        } else {
          this.loadBookForEdit(this.bookId);
        }
      }
    });

    this.loadGenres();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['operation'] && this.operation === 'edit') {
      this.loadBookForEdit(this.bookId);
    }
  }

  // Очистка формы
  clearForm() {
    this.bookForm = new FormGroup({
      name: new FormControl('', Validators.required),
      pages: new FormControl('', [Validators.required, Validators.min(1)]),
      genres: new FormControl('', Validators.required),
    });
  }

  loadBookForEdit(bookId: number) {
    const authorsCollection = JSON.parse(
      localStorage.getItem('AuthorsCollection') || '[]'
    );
    const author = authorsCollection.find(
      (author: any) => author.id === this.authorId
    );

    if (author) {
      const book = author.books.find((b: Book) => b.id === bookId);
      if (book) {
        this.editingBook = book;
        this.initializeBookForm(book);
      } else {
        console.error('Book not found');
      }
    } else {
      console.error('Author not found');
    }
  }

  initializeBookForm(book: Book) {
    this.bookForm = new FormGroup({
      name: new FormControl(book.name, Validators.required),
      pages: new FormControl(book.pages, [
        Validators.required,
        Validators.min(1),
      ]),
      genres: new FormControl(book.genres, Validators.required),
    });
  }

  onBack() {
    this.location.back();
  }

  onCancel() {
    this.onBack();
  }

  onSubmit() {
    this.submitted = true;
    if (this.bookForm.valid) {
      if (this.operation === 'edit') {
        this.update.emit(this.bookForm.value);
        this.saveBooksToLocalStorage();
      } else if (this.operation === 'create') {
        this.create.emit(this.bookForm.value);
        this.saveBooksToLocalStorage();
      }
    }
  }

  saveBooksToLocalStorage() {
    console.log(this.authorId);

    const authorsCollection: any[] = JSON.parse(
      localStorage.getItem('AuthorsCollection') || '[]'
    );

    const book = this.bookForm.value;

    if (this.authorId === null || isNaN(this.authorId)) {
      console.error('Author ID is missing or invalid.');
      return;
    }

    let author = authorsCollection.find(
      (author) => author.id === this.authorId
    );

    if (this.operation === 'edit' && this.editingBook) {
      if (author) {
        const bookIndex = author.books?.findIndex(
          (b: Book) => b.id === this.editingBook?.id
        );
        if (bookIndex !== -1) {
          author.books[bookIndex] = { ...this.editingBook, ...book };
        } else {
          console.warn('Book not found in author’s collection.');
        }
      } else {
        console.warn('Author not found.');
      }
    } else if (this.operation === 'create') {
      const newBook: Book = {
        id: Date.now(),
        ...book,
      };

      if (author) {
        if (!author.books) {
          author.books = [];
        }
        author.books.push(newBook);
      } else {
        console.error(
          'Author not found. Cannot create a book for a non-existent author.'
        );
      }
    }

    localStorage.setItem(
      'AuthorsCollection',
      JSON.stringify(authorsCollection)
    );
    this.clearForm();
  }

  loadGenres(): void {
    const genres = localStorage.getItem('GenresList');
    this.genresList = genres ? JSON.parse(genres) : [];
  }
}
