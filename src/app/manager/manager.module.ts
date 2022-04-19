import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { Routes } from '@angular/router'

import { ManagerHomeComponent } from './manager-home/manager-home.component'
import { ManagerRoutingModule } from './manager-routing.module'

@NgModule({
  declarations: [ManagerHomeComponent],
  imports: [CommonModule, ManagerRoutingModule],
})
export class ManagerModule {}
