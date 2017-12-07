import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProgressbarService } from '../../services/progressbar.service';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent implements OnInit, OnDestroy {
  
  visible;
  color;
  mode;
  value;
  bufferValue;
  subscription;


  constructor(
  private progressbarService: ProgressbarService) {
  }

  ngOnInit() {
    if (this.progressbarService !== undefined){
      this.subscription = this.progressbarService.latestMode().subscribe (data => {
      this.visible = data;
      })
    }
    this.mode = this.progressbarService.getMode();
    this.color = this.progressbarService.getColor();
    this.value = this.progressbarService.getValue();
    this.bufferValue = this.progressbarService.getBufferValue();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


}
