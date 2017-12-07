import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MessageSnackbarComponent } from '../components/message-snackbar/message-snackbar.component';

@Injectable()
export class MessageSnackbarService {

  constructor(
	private snackBar: MatSnackBar
  ) { }
  
/** if no TimeOut ERROR Error: ExpressionChangedAfterItHasBeenCheckedError */
  open(config){
    setTimeout(() => {
        this.snackBar.openFromComponent(MessageSnackbarComponent,{ data: config.data, duration: config.duration});
    }, 100)
  }

}
