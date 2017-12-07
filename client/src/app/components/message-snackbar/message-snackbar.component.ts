import { Component, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
  selector: 'app-message-snackbar',
  templateUrl: './message-snackbar.component.html',
  styleUrls: ['./message-snackbar.component.css']
})
export class MessageSnackbarComponent {

	message

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) 
  { 
  this.message = data
  }

}