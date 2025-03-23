import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpClient, HttpEventType, HttpHeaders, HttpResponse } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { map, pipe } from 'rxjs';
import {MatListModule} from '@angular/material/list';
import { LoaderComponent } from './components/loader/loader.component';
import { NavComponent } from './components/nav/nav.component';
import { TabsComponent } from './components/tabs/tabs.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatListModule,TabsComponent, LoaderComponent,NavComponent,MatCardModule, RouterOutlet, HttpClientModule,MatButtonModule, MatToolbarModule, MatFormFieldModule,MatInputModule, FormsModule,MatProgressBarModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';

  moveToTags():void
  {
    const tagsSection = document.getElementById('tagsSection');
    if (tagsSection) {
      tagsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

