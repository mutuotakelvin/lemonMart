import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { ManagerRoutingModule } from './manager-routing.module';
import { ManagerHomeComponent } from './manager-home/manager-home.component'

@NgModule({
  declarations: [
    ManagerHomeComponent
  ],
  imports: [CommonModule, ManagerRoutingModule],
})
export class ManagerModule {}
