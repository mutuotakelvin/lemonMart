import { Injectable } from '@angular/core'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'
import { Observable } from 'rxjs'

import { SimpleDialogComponent } from './simple-dialog.component'

@Injectable({
  providedIn: 'root',
})
export class UiService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}
  showToast(message: string, action = 'close', config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config || { duration: 700 })
  }
  showDialog(
    title: string,
    content: string,
    okText: 'ok',
    cancelText?: string,
    customerConfig?: MatDialogConfig
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(
      SimpleDialogComponent,
      customerConfig || {
        width: '300px',
        data: { title, content, okText, cancelText },
      }
    )
    return dialogRef.afterClosed()
  }
}
