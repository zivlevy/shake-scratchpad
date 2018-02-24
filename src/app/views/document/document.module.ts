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
import {FlexLayoutModule} from "@angular/flex-layout";
import { TaskViewerComponent } from './task-viewer/task-viewer.component';

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
    CoreModule,
    FlexLayoutModule
  ],
  declarations: [
    TreeViewComponent,
    TreeDocComponent,
    DocViewerComponent,
    TaskViewerComponent,
  ],
  exports: [TreeViewComponent,
    DocViewerComponent,
    TaskViewerComponent,
    TreeDocComponent
  ],
  providers: [
    DocumentService
  ]
})
export class DocumentModule {
}
