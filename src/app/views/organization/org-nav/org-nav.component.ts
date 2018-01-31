import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LanguageService} from '../../../core/language.service';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/retry';
import 'rxjs/add/observable/defer';
import {Org} from '../../../model/org';
import {User} from '../../../model/user';

@Component({
  selector: 'sk-org-nav',
  templateUrl: './org-nav.component.html',
  styleUrls: ['./org-nav.component.scss']
})
export class OrgNavComponent implements OnInit, OnDestroy {
  orgName: string;
  rtl = false;

  @Input()
  org: Org;

  @Input()
  user: User;


  destroy$: Subject<boolean> = new Subject<boolean>();
  returnRoute: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService) {
  }

  ngOnInit() {
    this.returnRoute = this.router.routerState.snapshot.url;

  }

  login() {
    const orgId = this.route.snapshot.params['id'];

    // this.router.navigate([`org/${this.org.orgId}/login`], {queryParams: {returnUrl: 'org/' + orgId}});
    this.router.navigate([`org/${this.org.orgId}/login`], {queryParams: {returnUrl: this.returnRoute}});

  }

  signup() {
    const orgId = this.route.snapshot.params['id'];
    // this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: {returnUrl: 'org/' + orgId}});
    this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: {returnUrl: this.returnRoute}});

  }

  join() {
    this.orgService.joinToOrg();
  }

  docManager() {
    this.router.navigate([`org/${this.org.orgId}/doc-manage`]);
  }



  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
