import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SkDoc} from '../../../model/document';
import {OrgService} from '../org.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/merge';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'sk-org-search-docs',
  templateUrl: './org-search-docs.component.html',
  styleUrls: ['./org-search-docs.component.scss']
})
export class OrgSearchDocsComponent implements OnInit, OnDestroy {

  @ViewChild('search') searchInput: ElementRef;

  documents: any[];
  searchTerm = '';
  docNameOnly: boolean = false;
  published: boolean = true;
  edited: boolean = false;
  version: boolean = false;
  checkboxClick$: Subject<any> = new Subject();

  constructor(private orgService: OrgService) {
  }

  ngOnInit() {

    Observable.merge(
      this.checkboxClick$.asObservable(),
      Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
      .debounceTime(500)
      .distinctUntilChanged())
      .switchMap(() => {
        return Observable.fromPromise(this.filterDocumentsByTerm());
      }).subscribe((res: any) => this.documents = res);
  }

  ngOnDestroy() {
  }

  filterDocumentsByTerm() {
    const value = this.searchTerm;
    if (value !== '') {
      return this.orgService.serachDocsByTerm(value, this.docNameOnly, this.edited, this.published, this.version);
    } else {
      return Promise.resolve([]);
    }
  }

}
