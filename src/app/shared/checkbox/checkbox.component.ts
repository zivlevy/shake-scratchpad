import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'sk-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent implements OnInit {
  @Input() checked: boolean;
  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  inputClicked() {
    this.valueChanged.emit(this.checked);
  }

}
