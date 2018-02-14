import {Component, OnDestroy, OnInit} from '@angular/core';
import {OrgService} from '../org.service';
import {Subject} from 'rxjs/Subject';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material';
import {FileService} from '../../../core/file.service';

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
              private fileService: FileService,
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
        'advanced': [false]

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

  get advanced() {
    return this.inviteForm.get('advanced').value;
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

  addInviteToTable() {
    const invite = new InviteRecord(this.displayName, this.email, this.isAdmin, this.isEditor, this.isViewer);
    this.invites.push(invite);
    this.dataSource.data = this.invites;
    this.initNewInvite();
  }

  deleteInviteFromTable(emailToDelete: string) {
    const index = this.invites.indexOf(this.findInviteInTable(emailToDelete));
    this.invites.splice(index, 1);
    this.dataSource.data = this.invites;
  }

  findInviteInTable(email: string) {
    return this.invites.find( (obj) => {
      return obj.email === email;
    });
  }

  sendInvite(invite: InviteRecord) {
    return this.orgService.setOrgInvites(this.orgId, invite.displayName, invite.email, invite.isAdmin, invite.isEditor, invite.isViewer);
  }

  manualSend() {
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

  tableInvitesSend() {
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

  readInvitesFromFile(event) {
    const inFile = event.target.files[0];
    this.fileService.readCsv(inFile)
      .then((lines: any) => {
        let isAdmin = false;
        let isEditor = false;
        let isViewer = false;

        console.log(lines);
        console.log(lines.length);

        for (const line of lines) {
          console.log(line);
          if (line.length >= 2) {
            isAdmin = this.fileService.stringToBoolean(line[2]);
            isEditor = this.fileService.stringToBoolean(line[3]);
            isViewer = this.fileService.stringToBoolean(line[4]);
          }
          const invite = new InviteRecord(line[0], line[1], isAdmin, isEditor, isViewer );
          this.invites.push(invite);
          this.dataSource.data = this.invites;
      }
    });
  }


  ngOnDestroy() {
    // force unsubscribe
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe();

  }
}
