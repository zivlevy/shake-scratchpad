import {NgModule} from '@angular/core';
import {
  MatButtonModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule, MatOptionModule, MatSelect,
  MatSelectModule
} from "@angular/material";
import {MatMenuModule} from '@angular/material/menu';

@NgModule({
  imports: [MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],
  exports: [MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule
  ],

  declarations: []
})
export class MaterialModule {
}
