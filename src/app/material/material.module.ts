import {NgModule} from '@angular/core';
import {MatButtonModule, MatDialogModule, MatIconModule} from '@angular/material';
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],

  declarations: []
})
export class MaterialModule {
}
