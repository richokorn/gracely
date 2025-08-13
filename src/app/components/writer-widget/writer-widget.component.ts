import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { WriterService } from '../../services/writer.service';

@Component({
  selector: 'app-writer-widget',
  imports: [InputText, FormsModule, InputText],
  templateUrl: './writer-widget.component.html',
  styleUrl: './writer-widget.component.scss',
  host: {
    class: 'layout-card col-item-1',
  },
})
export class WriterWidgetComponent implements AfterViewInit {
  @ViewChild('textAreaElement')
  textAreaElement!: ElementRef<HTMLTextAreaElement>;
  writerService: WriterService = inject(WriterService);

  ngAfterViewInit() {
    this.writerService.registerTextArea(this.textAreaElement);
    this.writerService.initTextArea();
  }

  onInput(): void {
    this.writerService.onInput();
  }
}
