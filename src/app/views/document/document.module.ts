import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DocumentRoutingModule} from './document-routing.module';
import {TreeViewComponent} from './tree-view/tree-view.component';
import {FormsModule} from '@angular/forms';
import {FroalaEditorModule, FroalaViewModule} from 'angular-froala-wysiwyg';
import {ContextMenuModule} from 'ngx-contextmenu';
import {MaterialModule} from '../../material/material.module';
import { TreeDocComponent } from './tree-doc/tree-doc.component';
import {TreeModule} from 'angular-tree-component';
import { DocViewerComponent } from './doc-viewer/doc-viewer.component';
import {DocumentService} from "./document.service";
import {CoreModule} from "../../core/core.module";

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
    CoreModule
  ],
  declarations: [
    TreeViewComponent,
    TreeDocComponent,
    DocViewerComponent,
  ],
  exports: [TreeViewComponent,
    DocViewerComponent,
    TreeDocComponent
  ],
  providers: [
    DocumentService
  ]
})
export class DocumentModule {
}
