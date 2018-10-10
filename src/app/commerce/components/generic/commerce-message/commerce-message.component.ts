import { Component, OnInit, Input } from '@angular/core';

const uniqueId = require('lodash/uniqueId');


export enum MessageType {
  ALERT = "alert",
  PRIMARY = "primary",
  SUCCESS = "success",
  WARNING = "warning",
  SECONDARY = "scondary"
}

@Component({
  selector: 'commerce-message',
  templateUrl: './commerce-message.component.html',
  styleUrls: ['./commerce-message.component.scss']
})
export class CommerceMessageComponent implements OnInit {

  id:any;

  constructor() { }

  ngOnInit() {
    this.id = uniqueId();
  }

  componentName: string = "commerce-message";

  /**
   * The resolved message string or a message key that can be used for translation
   */
  @Input() message: string;

  /**
   * A string represented messge type, must be one of <code>MessageType</code>
   */
  @Input() type: MessageType;

  /**
   * A function that can be called upon closing of the message
   * The close button will not be visible if this input is undefined or Null
   */
  @Input() close: Function;

}
