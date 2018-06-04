import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {OrgService} from '../org.service';
import {DocAck} from '../../../model/document';
import {Router} from '@angular/router';
import {takeUntil} from 'rxjs/operators';

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
      .pipe(takeUntil(this.destroy$))
      .subscribe(org => this.currentOrg = org);

    this.orgService.getOrgUserDocAcks$()
      .subscribe((res: DocAck[]) => {
        this.docsAcks = res;
      });
  }

  docAckClicked(docAck: DocAck) {
    this.router.navigate([`org/${this.currentOrg}/org-doc-view`, docAck.docId, 'p', 0, false, '**'])
      .catch(err => console.log(err));

  }

  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
