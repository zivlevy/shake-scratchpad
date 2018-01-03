import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../core/auth.service';
import {LanguageService} from '../../../core/language.service';
import {OrgService} from '../org.service';
import {OrgUser} from '../../../model/org-user';
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orgService: OrgService,
              private lngService: LanguageService,
              private authService: AuthService) {
  }

  ngOnInit() {

    // get current language
    this.lngService.getLanguadge$()
      .takeUntil(this.destroy$).subscribe(lng => {
      // console.log('get Lang', lng);
      this.rtl = lng === 'he' ? true : false;
    });

  }

  setLang(lng) {
    this.lngService.setLanguadge(lng);
    this.rtl = lng === 'he' ? true : false;
  }

  login() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`org/${this.org.orgId}/login`], {queryParams: {returnUrl: 'org/' + orgId}});
  }

  signup() {
    const orgId = this.route.snapshot.params['id'];
    this.router.navigate([`org/${this.org.orgId}/register`], {queryParams: {returnUrl: 'org/' + orgId}});
  }

  join() {
    this.orgService.joinToOrg();
  }

  ngOnDestroy() {
    console.log('unsub =======');
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
