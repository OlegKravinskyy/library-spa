import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpaModule } from '../spa/spa.module';
import { AppHomeComponent } from './routes/app-home/app-home.component';
import { AuthorsComponent } from './routes/authors/authors.component';
import { GenresComponent } from './routes/genres/genres.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './routes/app.routes';
import { MaintComponent } from './routes/maint/maint.component';
import { DetailComponent } from './routes/detail/detail.component';
import { AppDataService } from './services/app-data.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SpaHeaderComponent } from '../spa/spa-header/spa-header.component';
import { BookDetailsComponent } from './routes/book-details/book-details.component';

@NgModule({
  declarations: [
    AppComponent,
    AppHomeComponent,
    AuthorsComponent,
    GenresComponent,
    MaintComponent,
    DetailComponent,
    BookDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SpaModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [AppDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
