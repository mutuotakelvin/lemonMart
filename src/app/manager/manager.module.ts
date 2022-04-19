import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'

import { AppMaterialModule } from './../app-material.module'
import { ManagerHomeComponent } from './manager-home/manager-home.component'
import { ManagerRoutingModule } from './manager-routing.module'
import { ManagerComponent } from './manager.component';
import { UserManagementComponent } from './user-management/user-management.component'

@NgModule({
  declarations: [ManagerHomeComponent, ManagerComponent, UserManagementComponent],
  imports: [CommonModule, ManagerRoutingModule, AppMaterialModule],
})
export class ManagerModule {}
