import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './dashboard/dashboard.component';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TooltipModule } from 'primeng/tooltip';
import { ProjectComponent } from './project/project.component';
import { FrdComponent } from './frd/frd.component';
import { PrdComponent } from './prd/prd.component';
import { UsermanualComponent } from './usermanual/usermanual.component';
import { TechdocComponent } from './techdoc/techdoc.component';
import { ApidocComponent } from './apidoc/apidoc.component';
import { QuareqComponent } from './quareq/quareq.component';
import { MarketreqComponent } from './marketreq/marketreq.component';
import { TestplanComponent } from './testplan/testplan.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProjectComponent,
    FrdComponent,
    PrdComponent,
    UsermanualComponent,
    TechdocComponent,
    ApidocComponent,
    QuareqComponent,
    MarketreqComponent,
    TestplanComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    InputTextareaModule,
    SidebarModule,
    DropdownModule,
    TooltipModule,
    ToastModule,
    ProgressBarModule,
    NgxSpinnerModule.forRoot()
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
