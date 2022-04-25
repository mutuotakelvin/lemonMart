import { Injectable } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'

@Injectable({
  providedIn: 'root',
})
export class UiService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}
  showToast(message: string, action = 'close', config?: MatSnackBarConfig) {
    this.snackBar.open(message, action, config || { duration: 700 })
  }
}
