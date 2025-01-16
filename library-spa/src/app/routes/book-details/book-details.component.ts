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

    // Retrieve the authorId from the route parameters (if it's passed in)
    this.route.params.subscribe((params) => {
      this.operation = params['operation'];
      // Определяем authorId, если он присутствует
      if (params['authorId']) {
        this.authorId = +params['authorId'];
      }

      // Определяем bookId, если он присутствует
      if (params['bookId']) {
        this.bookId = +params['bookId'];
        this.loadBookForEdit(this.bookId); // Загрузка данных книги для редактирования
      }
      if (this.operation === 'edit') {
        if (this.bookToEdit) {
          this.bookForm.patchValue(this.bookToEdit); // Populate the form directly
        } else {
          this.loadBookForEdit(this.bookId); // Attempt to load the book from storage
        }
      }
    });

    console.log('Operation: OnInit', this.operation);
    console.log('Author ID: OnInit', this.authorId);
    console.log('book ID: OnInit', this.bookId);

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

  // Загрузка книги для редактирования
  // loadBookForEdit(bookId: number) {
  //   if (!this.authorId) {
  //     console.error('Author ID is missing or invalid.');
  //     return;
  //   }

  //   const authorsCollection: any[] = JSON.parse(
  //     localStorage.getItem('AuthorsCollection') || '[]'
  //   );

  //   console.log('Operation:', this.operation);
  //   console.log('Author ID:', this.authorId);

  //   const author = authorsCollection.find(
  //     (author) => author.id === this.authorId
  //   );

  //   if (!author || !author.books) {
  //     console.error('Author or books not found for the given author ID.');
  //     return;
  //   }

  //   this.editingBook = author.books[0]; // For simplicity, pick the first book (adjust as needed)

  //   if (this.editingBook) {
  //     this.bookForm.patchValue({
  //       name: this.editingBook.name,
  //       pages: this.editingBook.pages,
  //       genres: this.editingBook.genres,
  //     });
  //   } else {
  //     console.error('Book not found in the author’s collection.');
  //   }
  // }

  loadBookForEdit(bookId: number) {
    const authorsCollection = JSON.parse(
      localStorage.getItem('AuthorsCollection') || '[]'
    );
    const author = authorsCollection.find(
      (author: any) => author.id === this.authorId
    );

    console.log('Operation:', this.operation);
    console.log('Author ID:', this.authorId);
    console.log('Book ID: OnInit', this.bookId);

    if (author) {
      const book = author.books.find((b: Book) => b.id === bookId);
      if (book) {
        this.editingBook = book;
        this.initializeBookForm(book); // Инициализация формы с данными книги
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

  // Обработчик кнопки "Назад"
  onBack() {
    this.location.back();
  }

  // Обработчик кнопки "Отменить"
  onCancel() {
    this.onBack();
  }

  // Обработчик кнопки "Сохранить" или "Создать"
  onSubmit() {
    this.submitted = true;
    if (this.bookForm.valid) {
      if (this.operation === 'edit') {
        // Обновление существующей книги
        this.update.emit(this.bookForm.value);
        this.saveBooksToLocalStorage();
      } else if (this.operation === 'create') {
        // Создание новой книги
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

    console.log(this.authorId);
    console.log('authorsCollection:', authorsCollection);

    const book = this.bookForm.value;

    if (this.authorId === null || isNaN(this.authorId)) {
      console.error('Author ID is missing or invalid.');
      return;
    }

    let author = authorsCollection.find(
      (author) => author.id === this.authorId
    );

    if (this.operation === 'edit' && this.editingBook) {
      // If we are editing, find the book and update it
      if (author) {
        const bookIndex = author.books?.findIndex(
          (b: Book) => b.id === this.editingBook?.id
        );
        if (bookIndex !== -1) {
          author.books[bookIndex] = { ...this.editingBook, ...book }; // Update the book
        } else {
          console.warn('Book not found in author’s collection.');
        }
      } else {
        console.warn('Author not found.');
      }
    } else if (this.operation === 'create') {
      // Create new book
      const newBook: Book = {
        id: Date.now(), // Generate a unique ID
        ...book,
      };

      if (author) {
        // Initialize the books array if it doesn't exist
        if (!author.books) {
          author.books = [];
        }
        author.books.push(newBook); // Add new book to existing author
      } else {
        // If the author doesn't exist, handle the case (optional)
        console.error(
          'Author not found. Cannot create a book for a non-existent author.'
        );
      }
    }

    // Save the updated authors collection to localStorage
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
