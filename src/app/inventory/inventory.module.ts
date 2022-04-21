import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'

import { AppMaterialModule } from '../app-material.module'
import { CategoriesComponent } from './categories/categories.component'
import { InventoryHomeComponent } from './inventory-home/inventory.component'
import { InventoryRoutingModule } from './inventory-routing.module'
import { InventoryComponent } from './inventory.component'
import { ProductsComponent } from './products/products.component'
import { StockEntryComponent } from './stock-entry/stock-entry.component'

@NgModule({
  declarations: [
    InventoryHomeComponent,
    CategoriesComponent,
    ProductsComponent,
    StockEntryComponent,
    InventoryComponent,
  ],
  imports: [CommonModule, InventoryRoutingModule, AppMaterialModule],
})
export class InventoryModule {}
