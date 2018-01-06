import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule, MatCheckboxModule, MatIconModule} from "@angular/material";
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [MatMenuModule,
    MatButtonModule,
    MatIconModule
  ],

  declarations: []
})
export class MaterialModule {
}
