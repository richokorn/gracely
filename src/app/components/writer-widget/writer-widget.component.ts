import { Component } from '@angular/core';

@Component({
  selector: 'app-writer-widget',
  imports: [],
  templateUrl: './writer-widget.component.html',
  styleUrl: './writer-widget.component.scss',
  host: {
    class: 'app-writer-widget layout-card col-item-1',
  },
})
export class WriterWidgetComponent {}
