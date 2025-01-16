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
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FieldInput } from '../field-interface';

interface Book {
  id: number;
  name: string;
  pages: number;
  genres: string;
}

@Component({
  selector: 'spa-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() vm: any;
  @Input() vmDefinition!: Array<FieldInput>;
  @Input() operation!: string;
  @Input() errorMessage!: string;
  @Output() update: EventEmitter<any> = new EventEmitter();
  @Output() create: EventEmitter<any> = new EventEmitter();

  bookFields = [
    {
      key: 'name',
      label: 'Book Name',
      type: 'string',
      required: true,
      isId: false,
    },
    {
      key: 'pages',
      label: 'Pages',
      type: 'number',
      required: true,
      isId: false,
    },
    {
      key: 'genres',
      label: 'Genres',
      type: 'string',
      required: true,
      isId: false,
    },
  ];

  form!: FormGroup;
  status!: string;
  submitted = false;
  vmCopy: any;
  bookForm!: FormGroup; // Форма для редактирования книги
  editingBook: Book | null = null; // Текущая редактируемая книга

  authorId!: number; // Объявляем свойство authorId
  author: any = {}; // Инициализация объекта author

  readonly detail = 'detail';
  readonly edit = 'edit';
  readonly waiting = 'waiting';

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.authorId = +params['id']; // Retrieve the author id from the route params
      this.loadAuthorDetails(this.authorId); // Load the author details
    });
    this.clearForm();

    // Подписка на изменения параметров маршрута
    this.route.params.subscribe((params) => {
      this.operation = params['operation'];
      if (this.operation === 'edit') {
        this.loadBookForEdit();
      }
    });
    this.clearForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['errorMessage'].currentValue && this.status === 'waiting') {
      this.status = '';
    }
  }

  clearForm() {
    const group: { [key: string]: FormControl } = {};
    this.vmCopy = Object.assign({}, this.vm);

    // Создание формы на основе vmDefinition
    this.vmDefinition.forEach((field) => {
      group[field.key] = field.required
        ? new FormControl(this.vmCopy[field.key], Validators.required)
        : new FormControl(this.vmCopy[field.key]);
    });
    this.form = new FormGroup(group);
  }

  loadAuthorDetails(authorId: number) {
    const authorsCollection = localStorage.getItem('AuthorsCollection');
    if (authorsCollection) {
      const authors = JSON.parse(authorsCollection);
      // Find the author by id from the loaded authors
      const author = authors.find((author: any) => author.id === authorId);

      if (author) {
        this.author = {
          books: author.books || [], // Set the books of the author (or an empty array if not found)
        };
      } else {
        this.author = { books: [] }; // Fallback in case the author is not found
      }
    } else {
      this.author = { books: [] }; // Fallback if there is no authorsCollection in localStorage
    }
  }

  loadBookForEdit() {
    const bookId = 1; // Получаем ID книги (например, из параметров маршрута или localStorage)
    const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');
    this.editingBook = books.find((book) => book.id === bookId) || null;

    if (this.editingBook) {
      // Заполняем форму данными книги
      this.bookForm.setValue({
        name: this.editingBook.name,
        pages: this.editingBook.pages,
        genres: this.editingBook.genres,
      });
    }
  }

  // Обработчик кнопки "Назад"
  onBack() {
    this.errorMessage = '';
    this.location.back();
  }

  // Обработчик кнопки "Редактировать"
  onEdit() {
    this.router.navigate(['../', 'edit'], { relativeTo: this.route });
  }

  // Обработчик кнопки "Отменить"
  onCancel() {
    this.onBack();
  }

  // Обработчик кнопки "Сохранить"
  onSave() {
    this.submitted = true;
    if (this.form.valid) {
      this.status = 'waiting';
      this.update.emit(this.form.value);
      this.saveBooksToLocalStorage();
    }
  }

  // Обработчик кнопки "Создать"
  onCreate() {
    this.submitted = true;
    if (this.form.valid) {
      this.status = 'waiting';
      this.create.emit(this.form.value);
      this.saveBooksToLocalStorage();
    }
  }

  // Общий обработчик отправки формы
  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      this.status = this.waiting; // Устанавливаем статус на "ожидание"
      if (this.operation === this.edit) {
        this.update.emit(this.form.value); // Вызываем событие обновления
      } else if (this.operation === this.detail) {
        console.log('Detail mode, form submission is not applicable.');
      } else {
        this.create.emit(this.form.value); // Вызываем событие создания
      }
      this.saveBooksToLocalStorage();
    } else {
      console.error('Form is invalid');
    }
  }

  // Обработчик кнопки "Добавить книгу"
  addBook() {
    const operation = 'create';
    this.router.navigate(['/book-details', this.authorId, operation]);
  }

  // Обработчик кнопки "Редактировать книгу"
  editBook(book: Book) {
    const operation = 'edit';
    this.router.navigate(['/book-details', this.authorId, book.id, operation]);
  }

  // Инициализация формы для книги
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

  // Сохранение книги в localStorage
  saveBook() {
    if (this.bookForm.valid) {
      const book: Book = {
        id: this.editingBook ? this.editingBook.id : Date.now(), // Генерация ID для новой книги
        ...this.bookForm.value,
      };

      const books: Book[] = JSON.parse(localStorage.getItem('books') || '[]');

      if (this.operation === 'edit' && this.editingBook) {
        // Обновляем существующую книгу
        const index = books.findIndex((b) => b.id === this.editingBook?.id);
        if (index !== -1) {
          books[index] = book; // Заменяем старую книгу на обновленную
        }
      } else if (this.operation === 'create') {
        // Добавляем новую книгу
        books.push(book);
      }

      // Сохраняем книги в localStorage
      localStorage.setItem('books', JSON.stringify(books));

      // Перенаправляем на страницу со списком книг
      this.router.navigate(['/book-details']);
    }
  }

  // Сохранение данных о книгах в localStorage
  saveBooksToLocalStorage() {
    localStorage.setItem('authorBooks', JSON.stringify(this.author.books));
  }

  // Загрузка данных о книгах из localStorage
  loadBooksFromLocalStorage() {
    const books = localStorage.getItem('authorBooks');
    if (books) {
      this.author.books = JSON.parse(books);
    } else {
      this.author.books = []; // Если в localStorage нет данных, инициализируем пустым массивом
    }
  }

  // Отмена редактирования
  cancelEdit() {
    this.router.navigate(['/books']);
  }

  // Удаление книги
  deleteBook(authorId: number, bookId: number) {
    // Retrieve the AuthorsCollection from localStorage
    const authorsCollection = JSON.parse(
      localStorage.getItem('AuthorsCollection') || '[]'
    );

    // Find the author by id
    const author = authorsCollection.find(
      (author: any) => author.id === authorId
    );

    if (author) {
      // Find the index of the book to be deleted in the author's books array
      const bookIndex = author.books.findIndex(
        (book: Book) => book.id === bookId
      );

      if (bookIndex > -1) {
        // Remove the book from the array
        author.books.splice(bookIndex, 1);

        // Save the updated AuthorsCollection back to localStorage
        localStorage.setItem(
          'AuthorsCollection',
          JSON.stringify(authorsCollection)
        );

        this.loadAuthorDetails(authorId); // Перезагружаем книги и авторов
        this.clearForm(); // Обновляем форму, если нужно
      } else {
        console.error('Book not found');
      }
    } else {
      console.error('Author not found');
    }
  }
}
