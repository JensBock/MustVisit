import {Component, Output, EventEmitter} from '@angular/core';
import {MatChipInputEvent} from '@angular/material';
import {ENTER, COMMA} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-tag-search-bar',
  templateUrl: './tag-search-bar.component.html',
  styleUrls: ['./tag-search-bar.component.css']
})
export class TagSearchBarComponent {

 visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;

  @Output() tagEvent = new EventEmitter<array>();

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  tags = [];


  add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      this.tags.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagEvent.emit(this.tags);
  }

  remove(tag: any): void {
    let index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}
