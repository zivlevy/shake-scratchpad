import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import {ChildActivationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../core/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {OrgUser} from '../../model/org-user';
import * as firebase from 'firebase';
import {SkDoc, SkDocData} from '../../model/document';
import {FirestoreService} from '../../core/firestore.service';
import {ImageService} from '../../core/image.service';
import {TreeNode} from 'angular-tree-component';
import {OrgTreeNode} from '../../model/org-tree';

@Injectable()
export class OrgService {
  private currentOrg$: BehaviorSubject<string> = new BehaviorSubject('');
  isAuthenticated: boolean;
  private orgPublicData$: BehaviorSubject<any> = new BehaviorSubject({});
  private orgPrivateData$: BehaviorSubject<any> = new BehaviorSubject({});
  private localCurrentOrg: string;
  private currentSkUser;

  constructor(private authService: AuthService,
              private afs: AngularFirestore,
              private afAuth: AngularFireAuth,
              private router: Router,
              private imageService: ImageService,
              private firestoreService: FirestoreService,
              private fs: FirestoreService) {

    this.router.events
      .filter((event) => {
        return event instanceof ChildActivationEnd;
      })
      .filter((event: any) => {
        return event.snapshot._lastPathIndex === 1;
      })
      .map(event => event.snapshot.params.id)
      .distinctUntilChanged()
      .subscribe((id: any) => {
        this.setOrganization(id);
      });

    // get user authentication
    this.authService.isAuth$()
      .subscribe(isAuth => this.isAuthenticated = isAuth);

    // get current user
    this.authService.getSkUser$()
      .subscribe(skUser => {
        this.currentSkUser = skUser;
      });

    // set org public data updates
    this.updateOrgPublicData();
    this.updateOrgPrivateData();

  }

  private setOrganization(orgID: string) {
    console.log('setting current org to:' + orgID);
    this.localCurrentOrg = orgID;
    this.currentOrg$.next(orgID);

  }

  /************************
   Org User API
   ************************/

  joinToOrg() {
    this.authService.getSkUser$()
      .take(1)
      .subscribe(skUser => {
        this.setUserInfo(skUser)
          .then(() => {
            this.router.navigate([`org/${this.currentOrg$.getValue()}`]);
          });
      });

  }

  // Sets initial user data to firestore after successful org Join
  private setUserInfo(user) {
    // set the org to the user
    const orgUserRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}/orgs/${this.currentOrg$.getValue()}`);
    orgUserRef.set({});

    // set the user data in the org
    const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
    const data: OrgUser = {
      uid: user.uid,
      isPending: true,
      roles: {}, // must be empty object for permission
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL ? user.photoURL : ''
    };
    return userRef.set(data);
  }

  // Update additional user data
  updateOrgUser(uid: string, userData: OrgUser) {
    const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
    return userRef.update(userData);
  }

  // Delete additional user data
  deleteOrgUser(uid: string) {
    const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
    return userRef.delete();
  }

  getOrgUser$() {
    return this.afAuth.authState
      .switchMap((user => {
        if (!user) {
          return Observable.of(null);
        } else {
          // console.log(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          return userRef.valueChanges();
        }
      }));
  }

  getAllOrgUsers$(orgId: string) {
    return this.firestoreService.colWithIds$(`org/${orgId}/users`)
      .switchMap(data => {
        return Observable.of({'type': 'user', 'data': data});
      })
      .take(1);
  }

  deleteUserOrgRefP(orgId: string, uid: string) {
    const userOrgRef = this.afs.collection('users').doc(uid).collection('orgs').doc(orgId);
    return userOrgRef.delete();
  }

  deleteOrgUsersP(orgId: string) {
    return new Promise((resolve, reject) => {
      this.firestoreService.deleteCollection(`org/${orgId}/users`, 5)
        .subscribe(
          res => console.log(res),
          err => reject(err),
          () => resolve());
    });
  }

  /***************************
   Private functions
   **************************/

  private updateOrgPublicData() {

    this.currentOrg$
      .distinctUntilChanged()
      .switchMap(newOrgId => {
        if (!newOrgId) {
          return Observable.of(null);
        }
        const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${newOrgId}/publicData/info`);
        return document.valueChanges()
          .map(orgData => {
            console.log('here');
            if (orgData) {
              return orgData;
            } else {
              return null;
            }
          });
      }).subscribe(orgPublicData => this.orgPublicData$.next(orgPublicData));
  }

  private updateOrgPrivateData() {

    this.currentOrg$
      .distinctUntilChanged()
      .switchMap(newOrgId => {
        if (!newOrgId) {
          return Observable.of(null);
        }
        const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${newOrgId}`);
        return document.valueChanges()
          .map(orgData => {
            if (orgData) {
              return orgData;
            } else {
              return null;
            }
          });
      }).subscribe(orgPrivateData => this.orgPrivateData$.next(orgPrivateData));
  }

  /************************
   Org API
   ************************/

  getCurrentOrg$(): Observable<string> {
    return this.currentOrg$.asObservable();
  }


  getOrgPublicData$(): Observable<any> {
    return this.orgPublicData$.asObservable();
  }

  getOrgPrivateData$(): Observable<any> {
    return this.orgPrivateData$.asObservable();
  }

  // Written by Ran
  setOrgPublicData(orgId, newData) {
    const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${orgId}/publicData/info`);
    return document.update(newData);
  }

  deleteOrgPublicDataP(orgId) {
    const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${orgId}/publicData/info`);
    return document.delete();
  }
  getOrgDocs$(orgId: string): Observable<any> {
    const docsRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${orgId}/docs`);

    return docsRef.snapshotChanges()
      .switchMap((result: Array<any>) => {
        console.log('a', result);
        return Observable.forkJoin(
          result.map(doc => {
            console.log('b', doc);
            const docVersionsRef: AngularFirestoreCollection<any> = this.afs.collection( `org/${orgId}/docs/${doc.payload.doc.id}/versions`);
            return docVersionsRef.valueChanges();
          })
        );
      });
  }

  getOrgs$(): Observable<any> {

    const orgsRef: AngularFirestoreCollection<any> = this.afs.collection<any>('org');

    return orgsRef.snapshotChanges()
      .switchMap((result: Array<any>) => {
        return Observable.forkJoin(
          result.map(org => {
            const orgsRefInfo: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${org.payload.doc.id}/publicData/info`);
            return orgsRefInfo.valueChanges().take(1);
          }));
      });
  }

  getOrgData$(orgId: string): Observable<any> {
    return Observable.merge(
      this.getAllOrgDocs$(orgId),
      this.getAllOrgUsers$(orgId)
    );
  }

    deleteOrg(orgId: string) {
    // TODO handle collections removal
    // Algolia data deletion is performed by the cloud function triggered by this org deletion

    const deleteArray = new Array<Promise<any>>();

    // Documents are nested deepest, so we start here
    this.getOrgData$(orgId)
      .subscribe(
        (orgDataArray) => {

          // set 1st deletion stage

          if (orgDataArray.type === 'doc') {
            orgDataArray.data.forEach(doc => {
              deleteArray.push(this.deleteDocP(orgId, doc.id));
            });
          }

          if (orgDataArray.type === 'user') {
            orgDataArray.data.forEach(user => {
              deleteArray.push(this.deleteUserOrgRefP(orgId, user.uid));
            });
          }
        },
        null,
        () => {
          console.log('completed');
          deleteArray.push(this.deleteOrgPublicDataP(orgId));

          deleteArray.push(this.deleteOrgUsersP(orgId));

          // ToDo - find a way to delete the folder (not only the files)
          deleteArray.push(this.imageService.deleteOrgLogoP(orgId));
          deleteArray.push(this.imageService.deleteOrgBannerP(orgId));

          Promise.all(deleteArray)
            .then(() => {
              console.log('finished 1st deletion stage');

              // final stage

              const org: AngularFirestoreDocument<any> = this.afs.doc(`org/${orgId}`);
              return org.delete();
            })
            .then(() => console.log('org deleted'))
            .catch((err) => console.log('Document deletion problem', err));
        });

  }

  /************************
   Org Admin API
   ************************/
  getOrgUsersList$() {
    const orgUsersRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/users`);
    return orgUsersRef.snapshotChanges().map(actions => {
      return actions.map(a => {
        const data = a.payload.doc.data() as OrgUser;
        const id = a.payload.doc.id;
        return {uid: id, ...data};
      });
    });
  }

  /************************
   Org Documents
   ************************/
  getAllDocs$(): Observable<SkDoc[]> {
    const orgDocsRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/docs`);
    return orgDocsRef.snapshotChanges()
      .map(docs => {
        return docs.map(a => {
          const data = a.payload.doc.data() as SkDoc;
          const id = a.payload.doc.id;
          return {uid: id, ...data};
        });
      });
  }

  getAllOrgDocs$(orgId): Observable<any> {
    return this.firestoreService.colWithIds$(`org/${orgId}/docs`)
      .switchMap(data => {
        return Observable.of({'type': 'doc', 'data': data});
      }).take(1);
  }


  getDoc$(docId: string): Observable<SkDoc> {
    const docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${docId}`);
    return docRef.snapshotChanges()
      .map(res => {

        const doc: SkDoc = {uid: res.payload.id, ... res.payload.data()};
        return doc;
      });
  }

  addDoc(editVersion: SkDocData) {
    const docsRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/docs`);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    editVersion.createdBy = this.currentSkUser.uid;
    editVersion.createdAt = timestamp;
    const objToSave: SkDoc = {editVersion: editVersion, name: editVersion.name, version: 0};
    return docsRef.add(objToSave);
  }

  saveDoc(uid: string, editVersion: SkDocData) {
    const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}`);
    return docsRef.valueChanges().take(1).toPromise()
      .then(res => {
        if (res.name !== editVersion.name) { this.editDocNameInTree(uid, editVersion.name); }
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const nameObj = res.publishVersion ? {} : {name: editVersion.name};
        editVersion.createdBy = this.currentSkUser.uid;
        editVersion = {...editVersion, createdAt: timestamp};
        return docsRef.update({...nameObj, editVersion});
      });
  }

  publishDoc(uid: string, editVersion: SkDocData) {
    const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}`);

    return docsRef.valueChanges().take(1).toPromise()
      .then(res => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        // if current published - move to versions
        if (!res.publishVersion) {
          res['publishVersion'] = {...res.editVersion};
        }
        const docVersionsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}/versions/${res.version}`);
        docVersionsRef.set({...res.publishVersion, versionAt: timestamp, version: res.version || 0});

        // save editedVersion to PublishVersion
        editVersion.publishAt = timestamp;
        editVersion.publishBy = this.currentSkUser.uid;
        const objToSave = {
          version: (res.version || 0) + 1,
          editVersion,
          publishVersion: editVersion,
          name: editVersion.name,
          isPublish: true
        };
        return docsRef.update(objToSave);
      });
  }

  moveDocToPublic(doc: SkDoc) {
    // const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/publicDocs/${doc.uid}`);
    // return docsRef.set(doc);
    // TODO implement
  }


  deleteDoc(docId: string) {
    const docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${docId}`);
    const verRef = `org/${this.localCurrentOrg}/docs/${docId}/versions/`;
    this.firestoreService.deleteCollection(verRef, 5)
      .subscribe(res => console.log(res), null, () => {
        this.deleteDocFromTree(docId);
        docRef.delete(); }
      );

    // TODO remove from public as well
  }

  deleteDocP(orgId: string, docId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${orgId}/docs/${docId}`);
      const verRef =   `org/${orgId}/docs/${docId}/versions/`;
      console.log(orgId, docId);
      this.firestoreService.deleteCollection(verRef, 5)
        .subscribe(
          res => console.log(res),
          err => {
            console.log(err);
            reject(err);
          },
          () => {
            docRef.delete()
              .then(() => resolve())
              .catch(err => reject(err));
          }
        );
    });
  }

  getAllVersions$(docId: string): Observable<any> {
    const versionsRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/docs/${docId}/versions`);
    return versionsRef.snapshotChanges()
      .map(docs => {
        return docs.map(a => {
          const data = a.payload.doc.data() as SkDoc;
          const id = a.payload.doc.id;
          return {uid: id, ...data};
        });
      });
  }

  /****************************
   * Org Tree
   ***************************/

  /**********************************
   * build JSON tree from screen tree
   *********************************/

  makeJsonTree = (roots: Array<any>): string => {
    const result = [];
    roots.forEach( root => result.push(this.treeNodeToDBObject(root))) ;
    return JSON.stringify(result);
  }

  private treeNodeToDBObject(treeNode: TreeNode) {
    const node: OrgTreeNode = {};
    node.name = treeNode.data.name;
    if (treeNode.children) {
      node.children = [];
      treeNode.children.forEach(childNode => {
        node.children.push(this.treeNodeToDBObject(childNode));
      });
    }
    if (treeNode.data.isDoc) {
      console.log(treeNode)
      node.id = treeNode.data.id;
      node.docId = treeNode.data.docId;
      node.isDoc = true;
    } else {
      node.isDoc = false;
    }
    return node;
  }

  /**********************************
   * build JSON tree from memory tree
   *********************************/

  makeJsonTreeFromMemory = (roots: Array<any>): string => {
    const result = [];
    roots.forEach( root => result.push(this.treeNodeToDBObjectFromMemory(root))) ;
    return JSON.stringify(result);
  }

  private treeNodeToDBObjectFromMemory(treeNode: any) {
    const node: OrgTreeNode = {};
    node.name = treeNode.name;
    if (treeNode.children) {
      node.children = [];
      treeNode.children.forEach(childNode => {
        node.children.push(this.treeNodeToDBObjectFromMemory(childNode));
      });
    }
    if (treeNode.isDoc) {
      node.id = treeNode.id;
      node.docId = treeNode.docId;
      node.isDoc = true;
    } else {
      node.isDoc = false;
    }
    return node;
  }

  /***************************************/

  getOrgTreeFromJson$() {
    return this.fs.doc$(`org/${this.localCurrentOrg}`)
      .map((result: any) => {
        return JSON.parse(result.orgTreeJson);
      });
  }

  getTreeOrgDocs$() {
    return this.getAllDocs$()
      .switchMap(docs => {
        const freeDocs = [];
        docs.forEach((doc: SkDoc) => {
          const docItem = {
            id: doc.uid,
            name: doc.name,
            isDoc: true,
            docId: doc.uid
          };
          console.log(docItem)
          freeDocs.push(docItem);
        });
        return Observable.of(freeDocs);

      });
  }


  saveOrgTree(orgTreeJson: string) {
    this.fs.update(`org/${this.localCurrentOrg}`, {orgTreeJson});
  }


  // handle manuel doc removal from tree
  deleteDocFromTree( docId: string) {
    this.getOrgTreeFromJson$()
      .take(1)
      .subscribe( tree => {
        tree.forEach((item, index, array ) => {
          this.deleteOrgDocRecurtion(item, index, array, docId);
        });
        const treeJson = this.makeJsonTreeFromMemory(tree);
        this.saveOrgTree(treeJson);
      });
  }

  private deleteOrgDocRecurtion( treeNode, index, array, docId) {
    if (treeNode.children) {
      treeNode.children.forEach( (child, childIndex, childParent) => this.deleteOrgDocRecurtion(child, childIndex, childParent, docId));
    } else {
      if (treeNode.id === docId) {
        array.splice(index, 1 );
      }
    }
  }

  // handle manuel change of tree doc name
  editDocNameInTree( docId: string, newDocName: string ) {
    this.getOrgTreeFromJson$()
      .take(1)
      .subscribe( tree => {
        tree.forEach((item, index, array ) => {
          this.editOrgDocRecurtion(item, index, array, docId, newDocName);
        });
        const treeJson = this.makeJsonTreeFromMemory(tree);
        this.saveOrgTree(treeJson);
      });
  }
  private editOrgDocRecurtion( treeNode, index, array, docId, newDocName) {
    if (treeNode.children) {
      treeNode.children.forEach( (child, childIndex, childParent) => this.editOrgDocRecurtion(child, childIndex, childParent, docId, newDocName));
    } else {
      if (treeNode.id === docId) {
        treeNode.name = newDocName;
      }
    }
  }


}

