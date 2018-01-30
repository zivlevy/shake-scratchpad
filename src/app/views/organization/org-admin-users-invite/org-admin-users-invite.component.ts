import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';

export class InviteRecord {

  constructor(
    public displayName: string,
    public  email: string,
    public isAdmin: boolean,
    public isEditor: boolean,
    public isViewer: boolean) {

  }
}


@Component({
  selector: 'sk-org-admin-users-invite',
  templateUrl: './org-admin-users-invite.component.html',
  styleUrls: ['./org-admin-users-invite.component.scss']
})
export class OrgAdminUsersInviteComponent implements OnInit, OnDestroy {
  displayedColumns = ['displayName', 'email', 'isAdmin', 'isEditor', 'isViewer', 'Actions'];
  dataSource = new MatTableDataSource<InviteRecord>();

  inviteForm: FormGroup;

  invites: Array<InviteRecord>;
  orgId: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private orgService: OrgService,
              private fb: FormBuilder,
              private toastr: ToastrService) {
    this.initInvites();
  }


  ngOnInit() {

    this.inviteForm = this.fb.group({
        'displayName': ['', [
        ]
        ],
        'email': ['', [
          Validators.required,
          Validators.email
        ]
        ],
        'isAdmin': [false],
        'isEditor': [false],
        'isViewer': [true],

      }
    );

    this.orgService.getCurrentOrg$()
      .takeUntil(this.destroy$)
      .subscribe(orgId => {
        this.orgId = orgId;
      });
  }

  get displayName() {
    return this.inviteForm.get('displayName').value;
  }

  get email() {
    return this.inviteForm.get('email').value;
  }

  get isAdmin() {
    return this.inviteForm.get('isAdmin').value;
  }

  get isEditor() {
    return this.inviteForm.get('isEditor').value;
  }

  get isViewer() {
    return this.inviteForm.get('isViewer').value;
  }

  initNewInvite() {
    this.inviteForm.controls['displayName'].setValue('');
    this.inviteForm.controls['email'].setValue('');

    this.inviteForm.controls['isAdmin'].setValue(false);
    this.inviteForm.controls['isEditor'].setValue(false);
    this.inviteForm.controls['isViewer'].setValue(true);
  }

  initInvites() {
    this.invites = new Array<InviteRecord>();
  }

  addNew() {
    const invite = new InviteRecord(this.displayName, this.email, this.isAdmin, this.isEditor, this.isViewer);
    this.invites.push(invite);
    this.dataSource.data = this.invites;
    this.initNewInvite();
  }

  imiddiateSend() {
    const invite = new InviteRecord(this.displayName, this.email, this.isAdmin, this.isEditor, this.isViewer);
    this.initNewInvite();
    this.sendInvite(invite)
      .then(() => {
        this.toastr.success('Invitation Sent', '', {
          timeOut: 2000
        });
        this.initInvites();
      });
  }

  inviteDelete(emailToDelete: string) {
    const index = this.invites.indexOf(this.inviteFind(emailToDelete));
    this.invites.splice(index, 1);
    this.dataSource.data = this.invites;
  }

  inviteFind(email: string) {
    return this.invites.find( (obj) => {
      return obj.email === email;
    });
  }

  sendInvite(invite: InviteRecord) {
    return this.orgService.setOrgInvites(this.orgId, invite.displayName, invite.email, invite.isAdmin, invite.isEditor, invite.isViewer);
  }

  inviteTable() {
    const sendInvitesP: Array<any> = new Array<any>();
    for (const invite of this.invites) {
      sendInvitesP.push(this.sendInvite(invite));
    }
    Promise.all(sendInvitesP)
      .then(() => {
        this.toastr.success('Invitations Sent', '', {
          timeOut: 2000
        });
        this.initInvites();
        this.dataSource.data = this.invites;
      });
  }

  testBoolean(value) {
    console.log(value);

    if (value === 1) {
      return true;
    }

    if (value === 'true' || value === 'yes' || value === '1') {
      return true;
    }

    return false;
  }
  selectFile(event) {
    const inFile = event.target.files[0];
    const reader: FileReader = new FileReader();

    reader.readAsText(inFile);
    reader.onload = (e) => {
      const csv: string = reader.result;
      const allTextLines = csv.split(/\r|\n|\r/);
      const headers = allTextLines[0].split(',');
      const lines = [];

      for (let i = 0; i < allTextLines.length; i++) {
        // split content based on comma
        const data = allTextLines[i].split(',');
        if (data.length === headers.length) {
          const tarr = [];
          for (let j = 0; j < headers.length; j++) {
            tarr.push(data[j]);
          }

          const isAdmin = this.testBoolean(tarr[2]);
          const isEditor = this.testBoolean(tarr[3]);
          const isViewer = this.testBoolean(tarr[4]);
          const invite = new InviteRecord(tarr[0], tarr[1], isAdmin, isEditor, isViewer );
          this.invites.push(invite);
          this.dataSource.data = this.invites;
        }
      }
      // all rows in the csv file
      // console.log('>>>>>>>>>>>>>>>>>', lines);
    };
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
