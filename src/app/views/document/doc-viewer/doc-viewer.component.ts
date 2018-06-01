import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {SkItem, SkSection} from '../../../model/document';
import {DocumentService} from '../document.service';

@Component({
  selector: 'sk-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit, OnChanges {
  @Input() isRTL: boolean;
  @Input() isNumbering: boolean = true;
  @Input() isDocMap: boolean = false;
  @Input() docJson: string;
  @Input() ident: number = 10;
  @Input() searchPhrase: string = '';
  @Input() isSearch: boolean = false;

  @ViewChild('tree') tree;

  docList: Array<SkSection | SkItem>;
  nodes;
  options;

  constructor(private docService: DocumentService
  ) {
  }

  ngOnInit() {


  }

  ngOnChanges() {


    if (this.docJson) {
      this.docList = this.docService.SkTreeListFromJSON(this.docJson);
      if (this.isDocMap) {
        this.genDocMap();
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }
      this.doSearch();
    }
  }

  genDocMap() {
    this.nodes = this.docService.getMapTreeFromDocJson(this.docJson);

    this.options = {};
  }

  doSearch() {
    if (this.isSearch && this.searchPhrase !== '') {
      this.docList.forEach((item: any) => {
        const ref: string = `(\>[^\>\<]*)${this.searchPhrase}([^\>\<]*\<)`;
        item.data = item.data.replace(new RegExp(ref, 'g'), `$1<span style="background-color: lightcoral;">${this.searchPhrase}</span>$2`);
      });
    }
  }

}
