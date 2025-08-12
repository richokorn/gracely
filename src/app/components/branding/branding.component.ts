import { Component } from '@angular/core';
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-branding',
  imports: [TranslatePipe],
  templateUrl: './branding.component.html',
  styleUrl: './branding.component.scss',
})
export class BrandingComponent {}
