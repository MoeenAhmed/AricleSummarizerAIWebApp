import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';

import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [LoaderComponent,CommonModule,MatCardModule,MatTabsModule,MatButtonModule, MatToolbarModule, MatFormFieldModule,MatInputModule, FormsModule,MatProgressBarModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.css'
})
export class TabsComponent {

  
  currentFile?: File;
  progressValue = 0;
  message = '';
  fileName = 'Select File';
  loading: boolean = false;
  data:AIModelResponse;
  textAreaText:string=""


  constructor(private http:HttpClient){
    this.data = {Title:"", Summary:"", Tags:"" };
    console.log(this.data.Tags);

  }

  selectFile(event: any): void 
  {
    this.loading = true;
    this.progressValue = 0;
    if (event.target.files && event.target.files[0]) 
    {
      this.progressValue = 30;
      const file: File = event.target.files[0];
      this.progressValue = 60;
      this.currentFile = file;
      this.fileName = this.currentFile.name;
      this.progressValue = 100;
    } 
    else
    {
      this.fileName = 'Select File';
    }
    setTimeout(()=>this.loading = false, 1000)
  }

  upload(): void {
    this.data = {Title:"", Summary:"", Tags:"" };

    this.loading = true;
    this.progressValue = 0;
    this.message = '';
    if (this.currentFile)
    {
      var call = this.sendHttpCall(this.currentFile);
      call.subscribe(
        (response: any) => {
          //alert("API call success");
          console.log(response);
          const apiRes : AIModelResponse = JSON.parse(response);
          console.log(apiRes.Summary);
          this.data.Summary = apiRes.Summary;
          this.data.Title = apiRes.Title;
          this.data.Tags = apiRes.Tags
          setTimeout(()=>this.loading = false, 500)
        }
        
      );
    }
  }

  sendHttpCall(file:File)
  {
    const formData = new FormData();
    formData.append('file',  file, file.name);


    const headers = new HttpHeaders({
      'Accept': 'application/json',
    });

    return this.http.post<ApiResponse>('https://localhost:7164/api/PdfAnlyzer/HandleFileUpload', formData, { headers }).
    pipe(
      map((response) => response.response)  
    );
  }
  
  onTabChange(event: any): void {
    console.log('Selected tab index:', event.index);
    console.log('Selected tab label:', event.tab.textLabel);
  }

  TextAreaButtonCLick()
  {
    this.data = {Title:"", Summary:"", Tags:"" };

    this.loading = true;

    if(this.textAreaText == ""){
      return; 
    }
    
    console.log("TextAreaButtonCLick clicked");
    console.log(this.textAreaText);

    const params = new HttpParams()
      .set('pdfContent', this.textAreaText)
      
    this.http.get<ApiResponse>('https://localhost:7164/api/PdfAnlyzer/AnalyzePdf', { params}).pipe(
      map((response) => response.response)  
    ).subscribe(
      (response: any) => {
        //alert("API call success");
        console.log(response);
        const apiRes : AIModelResponse = JSON.parse(response);
        console.log(apiRes.Summary);
        this.data.Summary = apiRes.Summary;
        this.data.Title = apiRes.Title;
        this.data.Tags = apiRes.Tags
        setTimeout(()=>this.loading = false, 500)
        this.loading = false;
      }
      
    );

    
  }

}

export interface ApiResponse{
  status:string
  response: AIModelResponse
}
export interface AIModelResponse{
  Title: string,
  Summary: string
  Tags: string
}
