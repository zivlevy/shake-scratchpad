import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subject} from "rxjs/Subject";
import {OrgService} from "../org.service";
import {OrgUser} from "../../../model/org-user";

@Component({
  selector: 'sk-org-messages',
  templateUrl: './org-messages.component.html',
  styleUrls: ['./org-messages.component.scss']
})
export class OrgMessagesComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  docsAcks;
  currentOrgUser: OrgUser;

  constructor(private orgService: OrgService,) { }

  ngOnInit() {
    this.orgService.getOrgUserDocAcks$()
      .subscribe(res => {
        console.log(res);
        this.docsAcks = res;
      });
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();
  }
}
