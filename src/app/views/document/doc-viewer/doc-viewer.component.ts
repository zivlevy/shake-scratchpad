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
      const docObject = JSON.parse(this.docJson);
      this.docList = this.docService.SkTreeListFromJSON(docObject);
      if (this.isDocMap) {
        this.genDocMap(docObject);
        setTimeout(() => {
          this.tree.treeModel.expandAll();
        }, 0);
      }
      this.doSearch();
    }
  }

  genDocMap(docObject) {
    this.nodes = this.docService.getMapTreeFromDocJson(docObject);

    this.options = {rtl: this.isRTL};
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
