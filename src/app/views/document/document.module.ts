import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocumentRoutingModule} from './document-routing.module';
import {TreeViewComponent} from './tree-view/tree-view.component';
import {FormsModule} from '@angular/forms';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {ContextMenuModule} from 'ngx-contextmenu';
import {MaterialModule} from '../../material/material.module';
import {DocEditorComponent} from './doc-editor/doc-editor.component';
import { TreeDocComponent } from './tree-doc/tree-doc.component';
import {TreeModule} from "angular-tree-component";
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';

@NgModule({
  imports: [
    ContextMenuModule,
    CommonModule,
    DocumentRoutingModule,
    FormsModule,
    FroalaEditorModule,
    FroalaViewModule,
    MaterialModule,
    TreeModule,
  ],
  declarations: [
    TreeViewComponent,
    DocEditorComponent,
    TreeDocComponent,
    DocViewerComponent,
  ],
  exports: [TreeViewComponent,
    DocEditorComponent,
    DocViewerComponent,
    TreeDocComponent]
})
export class DocumentModule {
}
