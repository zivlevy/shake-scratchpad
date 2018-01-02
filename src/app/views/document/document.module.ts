import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocumentRoutingModule } from './document-routing.module';
import { TreeViewComponent } from './tree-view/tree-view.component';
import {FormsModule} from "@angular/forms";
import { TestTreeComponent } from './test-tree/test-tree.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";

@NgModule({
  imports: [
    CommonModule,
    DocumentRoutingModule,
    FormsModule,
    FroalaEditorModule,
    FroalaViewModule
  ],
  declarations: [TreeViewComponent, TestTreeComponent, ItemInfoComponent],
  exports: [TreeViewComponent,
            TestTreeComponent]
})
export class DocumentModule { }
