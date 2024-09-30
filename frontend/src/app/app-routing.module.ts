import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './auth.guard';
import { ProjectComponent } from './project/project.component';
import { FrdComponent } from './frd/frd.component';
import { PrdComponent } from './prd/prd.component';
import { UsermanualComponent } from './usermanual/usermanual.component';
import { TechdocComponent } from './techdoc/techdoc.component';
import { ApidocComponent } from './apidoc/apidoc.component';
import { QuareqComponent } from './quareq/quareq.component';
import { MarketreqComponent } from './marketreq/marketreq.component';
import { TestplanComponent } from './testplan/testplan.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path:'', redirectTo:'home', pathMatch:'full' },
  { path:'home', component: HomeComponent },
  { path:'login', component: LoginComponent },
  { path:'register', component: RegisterComponent },
  { path: 'brd', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'project', component: ProjectComponent, canActivate: [authGuard] },
  { path: 'frd', component: FrdComponent, canActivate: [authGuard] },
  { path: 'prd', component: PrdComponent, canActivate: [authGuard] },
  { path: 'usermanual', component: UsermanualComponent, canActivate: [authGuard] },
  { path: 'techdoc', component: TechdocComponent, canActivate: [authGuard] },
  { path: 'apidoc', component: ApidocComponent, canActivate: [authGuard] },
  { path: 'qualityreq', component: QuareqComponent, canActivate: [authGuard] },
  { path: 'mrd', component: MarketreqComponent, canActivate: [authGuard] },
  { path: 'testplan', component: TestplanComponent, canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
