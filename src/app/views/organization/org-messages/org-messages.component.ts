import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {OrgService} from '../org.service';
import {DocAck} from '../../../model/document';
import {Router} from '@angular/router';
import 'rxjs/add/operator/takeUntil';
@Component({
  selector: 'sk-org-messages',
  templateUrl: './org-messages.component.html',
  styleUrls: ['./org-messages.component.scss']
})
export class OrgMessagesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  docsAcks: DocAck[];
  currentOrg: string;

  constructor(private orgService: OrgService,
              private router: Router) { }

  ngOnInit() {
    // get current org
    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(org => this.currentOrg = org);

    this.orgService.getOrgUserDocAcks$()
      .subscribe((res: DocAck[]) => {
        this.docsAcks = res;
      });
  }

  docAckClicked(docAck: DocAck) {
    console.log(docAck.docId);
    this.router.navigate([`org/${this.currentOrg}/org-doc-view`, docAck.docId, 'p', 0, false, null])
      .catch(err => console.log(err));

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
