import { Routes } from '@angular/router';
import { AppHomeComponent } from './app-home/app-home.component';
import { AuthorsComponent } from './authors/authors.component';
import { DetailComponent } from './detail/detail.component';
import { DynamicFormComponent } from '../../spa/dynamicForms/dynamic-form/dynamic-form.component';
import { GenresComponent } from './genres/genres.component';
import { BookDetailsComponent } from './book-details/book-details.component';

export const appRoutes: Routes = [
  { path: 'home', component: AppHomeComponent },
  { path: 'genres', component: GenresComponent },
  { path: 'authors', component: AuthorsComponent },
  { path: 'detail/:id/:operation', component: DetailComponent },
  {
    path: 'book-details/:authorId/:operation',
    component: BookDetailsComponent,
  },
  {
    path: 'book-details/:authorId/:bookId/:operation',
    component: BookDetailsComponent,
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', component: AppHomeComponent },
];
