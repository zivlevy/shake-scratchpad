import {NgModule} from '@angular/core';
import {
    MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule,
    MatToolbarModule
} from '@angular/material';
import {MatListModule} from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';

@NgModule({
    imports: [MatListModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule],
    exports: [MatListModule,
        MatCardModule,
        MatButtonModule,
        MatCheckboxModule,
        MatInputModule,
        MatToolbarModule,
        MatIconModule]
})
export class MyMaterialModule {
}
