import {Injectable} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/combineLatest';
import {ChildActivationEnd, Router} from '@angular/router';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {AuthService} from '../../core/auth.service';
import {AngularFireAuth} from 'angularfire2/auth';
import {OrgUser} from '../../model/org-user';
import * as firebase from 'firebase';
import {DocAck, SkDoc, SkDocData} from '../../model/document';
import {FirestoreService} from '../../core/firestore.service';
import {ImageService} from '../../core/image.service';
import {TreeNode} from 'angular-tree-component';
import {OrgTreeNode} from '../../model/org-tree';
import {AlgoliaService} from '../../core/algolia.service';
import {LanguageService} from '../../core/language.service';
import {OrgDocService} from './org-doc.service';


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
              private algoliaService: AlgoliaService,
              private orgDocService: OrgDocService,
              private lngService: LanguageService) {

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

        // set org public data updates
        this.updateOrgPublicData();

        // get org private date
        this.getOrgUser$()
          .subscribe(orgUser => {
            if (orgUser && !orgUser.isPending) {
              this.updateOrgPrivateData();
            }
          });
      });

    // get user authentication
    this.authService.isAuth$()
      .subscribe(isAuth => this.isAuthenticated = isAuth);

    // get current user
    this.authService.getSkUser$()
      .subscribe(skUser => {
        this.currentSkUser = skUser;
      });
  }

  private setOrganization(orgID: string) {
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
        this.setUserInfo(skUser);
          // .then(() => {
          //   this.router.navigate([`org/${this.currentOrg$.getValue()}`]);
          // });
      });

  }

  // Sets initial user data to firestore after successful org Join
  private setUserInfo(user) {
    // set the org to the user
    console.log(this.orgPublicData$.getValue().orgName);
    const orgUserRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}/orgs/${this.currentOrg$.getValue()}`);
    orgUserRef.set({
      orgName: this.orgPublicData$.getValue().orgName
    });

    // set the user data in the org
    console.log(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
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

  updateOrgUsersOrgName(orgId: string, orgName: string) {
    const actions: Array<any> = new Array<any>();
    return new Promise<any>(resolve => {
      this.firestoreService.colWithIds$(`org/${orgId}/users`)
        .subscribe(users => {
          users.forEach(user => {
            const action = this.afs.doc(`users/${user.id}/orgs/${orgId}`).set({orgName: orgName});
            actions.push(action);
          });
          Promise.all(actions)
            .catch(err => console.log(err))
            .then(resolve);
        });
    });

  }

  // Update additional user data
  updateOrgUser(uid: string, userData: OrgUser) {
    const userRef = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`);
    return userRef.update(userData);
  }

  // Delete additional user data
  deleteOrgUser(uid: string) {
    const orgUserDelete = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${uid}`).delete();
    const userOrgDelete = this.afs.doc(`users/${uid}/orgs/${this.currentOrg$.getValue()}`).delete();

    return Promise.all([orgUserDelete, userOrgDelete]);
  }

  getOrgUser$() {
    return this.afAuth.authState
      .switchMap((user => {
        if (!user) {
          return Observable.of(null);
        } else {
          const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${this.currentOrg$.getValue()}/users/${user.uid}`);
          return userRef.valueChanges();
        }
      }));
  }

  getOrgUserByOrgID$(orgId) {
    return this.afAuth.authState
      .switchMap((user => {
        if (!user) {
          return Observable.of(null);
        } else {
          const userRef: AngularFirestoreDocument<OrgUser> = this.afs.doc(`org/${orgId}/users/${user.uid}`);
          return userRef.valueChanges();
        }
      }));
  }

  getOrgUserInvite$(orgId: string, email: string) {
    return this.afs.collection('org').doc(orgId).collection('invites').doc(email).valueChanges();
  }

  getOrgUsersInvites$(orgId: string) {
    return this.firestoreService.colWithIds$(`org/${orgId}/invites`);
  }

  deleteOrgUserInviteP(orgId: string, email: string): Promise<any> {
    return this.afs.collection('org').doc(orgId).collection('invites').doc(email).delete();
  }

  addOrgToUser(orgId: string, uid: string) {
    return this.afs.collection('users').doc(uid).collection('orgs').doc(orgId).set({});

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
            if (orgData) {
              return orgData;
            } else {
              return null;
            }
          });
      }).subscribe(orgPublicData => {
      if (orgPublicData) {
        this.lngService.setLanguadge(orgPublicData.language);
      }
      this.orgPublicData$.next(orgPublicData);
    });
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

  // getOrgNameP(orgId: string): Promise<string> {
  //   return new Promise<string>((resolve) => {
  //     const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${orgId}/publicData/info`);
  //     document.valueChanges()
  //       .take(1)
  //       .subscribe(res => {
  //         resolve(res ? res.orgName : null);
  //       });
  //   });
  // }

  setOrgPublicData(orgId, newData) {
    const document: AngularFirestoreDocument<any> = this.afs.doc(`org/${orgId}/publicData/info`);
    return document.update(newData);
  }

  setOrgInvites(orgId, displayName, email, isAdmin, isEditor, isViewer) {
    const emailLowerCase = email.toLowerCase();
    return this.firestoreService.upsert(`org/${orgId}/invites/${emailLowerCase}`, {
      'displayName': displayName,
      'isAdmin': isAdmin,
      'isEditor': isEditor,
      'isViewer': isViewer
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

  getDoc$(docId: string): Observable<SkDoc> {
    const docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${docId}`);
    return docRef.snapshotChanges()
      .map(res => {

        const doc: SkDoc = {uid: res.payload.id, ... res.payload.data()};
        return doc;
      });
  }

  addDoc(editVersion: SkDocData) {
    return new Promise<string>((resolve, reject) => {
      const docsRef: AngularFirestoreCollection<any> = this.afs.collection<any>(`org/${this.localCurrentOrg}/docs`);
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      editVersion.createdBy = this.currentSkUser.uid;
      editVersion.createdAt = timestamp;
      const objToSave: SkDoc = {editVersion: editVersion, name: editVersion.name, version: 0};
      docsRef.add(objToSave)
        .then(doc => this.addDocToTreeRoot(doc.id, objToSave))
        .then(docId => resolve(docId))
        .catch(err => reject(err));
    });
  }

  saveDoc(uid: string, editVersion: SkDocData) {
    const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}`);
    return docsRef.valueChanges().take(1).toPromise()
      .then(res => {
        // if (res.name !== editVersion.name) { this.editDocNameInTree(uid, editVersion.name); }
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const nameObj = res.publishVersion ? {} : {name: editVersion.name};
        editVersion.createdBy = this.currentSkUser.uid;
        editVersion = {...editVersion, createdAt: timestamp};
        return docsRef.update({...nameObj, editVersion});
      });
  }

  publishDocById(docId: string){
    const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${docId}`);
    docsRef.valueChanges().take(1).toPromise()
      .then(res => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const editVersion = res.editVersion;
        // save editedVersion to PublishVersion
        editVersion.publishAt = timestamp;
        editVersion.publishBy = this.currentSkUser.uid;

        const objToSave = {
          editVersion,
          publishVersion: editVersion,
          name: editVersion.name,
          isPublish: true
        };

          objToSave['version'] = (res.version || 0) + 1;

          // if current published - move to versions
          if (!res.publishVersion) {
            res['publishVersion'] = {...res.editVersion};
          } else {
            const docVersionsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${docId}/versions/${res.version}`);
            docVersionsRef.set({...res.publishVersion, versionAt: timestamp, version: res.version || 0});
          }

        // change  in tree
        this.editDocInTree(docId, objToSave);

        return docsRef.update(objToSave);
      } );
  }

  publishDoc(uid: string, editVersion: SkDocData, updateVersionNo: boolean = true) {
    const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}`);

    return docsRef.valueChanges().take(1).toPromise()
      .then(res => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        // save editedVersion to PublishVersion
        editVersion.publishAt = timestamp;
        editVersion.publishBy = this.currentSkUser.uid;

        const objToSave = {
          editVersion,
          publishVersion: editVersion,
          name: editVersion.name,
          isPublish: true
        };

        // if we only want to update the published version without adding new version
        if (!updateVersionNo) {

        } else {
          objToSave['version'] = (res.version || 0) + 1;

          // if current published - move to versions
          if (!res.publishVersion) {
            res['publishVersion'] = {...res.editVersion};
          } else {
            const docVersionsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}/versions/${res.version}`);
            docVersionsRef.set({...res.publishVersion, versionAt: timestamp, version: res.version || 0});
          }
        }
        // change  in tree
        this.editDocInTree(uid, objToSave);

        return docsRef.update(objToSave);
      });
  }

  unPublishDoc(uid: string) {
    const docsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}`);

    return docsRef.valueChanges().take(1).toPromise()
      .then(res => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();

        const objToSave = {
          editVersion: {...res.publishVersion},
          publishVersion: null,
          name: res.publishVersion.name,
          isPublish: false
        };
        const docVersionsRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${uid}/versions/${res.version}`);
        docVersionsRef.set({...res.publishVersion, versionAt: timestamp, version: res.version || 0});

        // change  in tree
        this.editDocInTree(uid, objToSave);

        return docsRef.update(objToSave);
      });
  }

  serachDocsByTerm(searchString: string, namesOnly: boolean, edited: boolean, published: boolean, version: boolean) {
    const orgPrivateData = this.orgPrivateData$.getValue();
    return this.algoliaService.searchDocs(this.localCurrentOrg, orgPrivateData.searchKey, searchString, namesOnly, edited, published, version);
  }

  deleteDoc(docId: string) {
    const docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${this.localCurrentOrg}/docs/${docId}`);
    const verRef = `org/${this.localCurrentOrg}/docs/${docId}/versions/`;
    this.firestoreService.deleteCollection(verRef, 5)
      .subscribe(res => console.log(res), null, () => {
          this.deleteDocFromTree(docId);
          docRef.delete();
        }
      );
  }

  deleteDocVersion(docId: string, version: string) {
    return this.firestoreService.delete(`org/${this.localCurrentOrg}/docs/${docId}/versions/${version}`);
  }

  deleteDocP(orgId: string, docId: string): Promise<any> {

    // TODO add remove from tree
    return new Promise((resolve, reject) => {
      const docRef: AngularFirestoreDocument<any> = this.afs.doc<any>(`org/${orgId}/docs/${docId}`);
      const verRef = `org/${orgId}/docs/${docId}/versions/`;
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

  getDocVersion$(docId: string, versionNo: number) {
    return this.firestoreService.doc$(`org/${this.localCurrentOrg}/docs/${docId}/versions/${versionNo}`);
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
    roots.forEach(root => result.push(this.treeNodeToDBObject(root)));
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
      node.id = treeNode.data.id;
      node.docId = treeNode.data.docId;
      node.isDoc = true;
      node.isPublish = treeNode.data.isPublish;
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
    roots.forEach(root => result.push(this.treeNodeToDBObjectFromMemory(root)));
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
      node.isPublish = treeNode.isPublish;
    } else {
      node.isDoc = false;
    }
    return node;
  }

  /***************************************/

  private getOrgTreeFromJson$(): Observable<Array<OrgTreeNode>> {

    return this.getCurrentOrg$()
      .switchMap(currentOrg => {
        return this.firestoreService.doc$(`org/${currentOrg}`)
          .map((result: any) => {
            const tree = JSON.parse(result.orgTreeJson);
            return tree;
          });
      });
  }

  private getOrgJsonTree(): Observable<string> {
    return this.getCurrentOrg$()
      .switchMap(currentOrg => {
        return this.firestoreService.doc$(`org/${currentOrg}`)
          .map((result: any) => {
            return result.orgTreeJson;
          });
      });
  }

  getOrgTreeByUser$(): Observable<any> {
    return Observable.combineLatest(this.getOrgUser$(), this.getOrgTreeFromJson$())
      .map(res => {
        const user = res[0];
        const tree = res [1];
        if (user.roles.editor) {
          return tree;
        } else {
          const publicTree = [];
          tree.forEach(treeNode => {
            const node = this.makePublishTree(treeNode);
            if (node) { publicTree.push( node ); }
          });
          return publicTree;
        }
      });
  }

  // helper - take an org tree and removes non publish docs
  private makePublishTree(treeNode: OrgTreeNode) {
    if (treeNode.children) {
      const clean = treeNode.children.filter(node => node.children || node.isPublish);
      clean.forEach(node => {
        if (node.children) {
          this.makePublishTree(node);
        }
      });
      treeNode.children = clean;
      return treeNode;
    } else {
      if (treeNode.isDoc && treeNode.isPublish) {
        return treeNode;
      } else { return null; }
    }
  }

  getTreeOrgDocs$() {
    return Observable.combineLatest(this.getAllDocs$(), this.getOrgTreeFromJson$())
      .switchMap(res => {
        const docs = res[0];
        const orgTree = JSON.stringify(res[1]);
        const freeDocs = [];
        docs.forEach((doc: SkDoc) => {
          if (orgTree.indexOf(doc.uid) === -1) {
            const docItem = {
              id: doc.uid,
              name: doc.name,
              isDoc: true,
              docId: doc.uid
            };
            freeDocs.push(docItem);
          }
        });
        return Observable.of(freeDocs);
      });
  }


  saveOrgTree(orgTreeJson: string) {
    return this.firestoreService.update(`org/${this.localCurrentOrg}`, {orgTreeJson});
  }


  // handle manuel doc removal from tree
  deleteDocFromTree(docId: string) {
    this.getOrgTreeFromJson$()
      .take(1)
      .subscribe(tree => {
        tree.forEach((item, index, array) => {
          this.deleteOrgDocRecursion(item, index, array, docId);
        });
        const treeJson = this.makeJsonTreeFromMemory(tree);
        this.saveOrgTree(treeJson);
      });
  }

  private deleteOrgDocRecursion(treeNode, index, array, docId) {
    if (treeNode.children) {
      treeNode.children.forEach((child, childIndex, childParent) => this.deleteOrgDocRecursion(child, childIndex, childParent, docId));
    } else {
      if (treeNode.docId === docId) {
        array.splice(index, 1);
      }
    }
  }

  // handle manuel change of tree doc name
  editDocNameInTree(docId: string, newDocName: string) {
    this.getOrgTreeFromJson$()
      .take(1)
      .subscribe(tree => {
        tree.forEach((item, index, array) => {
          this.editOrgDocNameRecurtion(item, index, array, docId, newDocName);
        });
        const treeJson = this.makeJsonTreeFromMemory(tree);
        this.saveOrgTree(treeJson);
      });
  }

  private editOrgDocNameRecurtion(treeNode, index, array, docId, newDocName) {
    if (treeNode.children) {
      treeNode.children.forEach((child, childIndex, childParent) => this.editOrgDocNameRecurtion(child, childIndex, childParent, docId, newDocName));
    } else {
      if (treeNode.id === docId) {
        treeNode.name = newDocName;
      }
    }
  }


  // handel tree node update
  editDocInTree(docId: string, docData: SkDoc) {
    this.getOrgTreeFromJson$()
      .take(1)
      .subscribe(tree => {
        tree.forEach((item, index, array) => {
          this.editOrgDocRecurtion(item, index, array, docId, docData);
        });
        const treeJson = this.makeJsonTreeFromMemory(tree);
        this.saveOrgTree(treeJson);
      });
  }


  private editOrgDocRecurtion(treeNode, index, array, docId, docData) {
    if (treeNode.children) {
      treeNode.children.forEach((child, childIndex, childParent) => this.editOrgDocRecurtion(child, childIndex, childParent, docId, docData));
    } else {
      if (treeNode.id === docId) {
        treeNode.name = docData.name;
        treeNode.isPublish = docData.isPublish;
        treeNode.isDoc = true;
      }
    }
  }


  // when adding a doc for the first time it is added to tree root
  private addDocToTreeRoot(docId: string, doc: SkDoc): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.getOrgTreeFromJson$()
        .take(1)
        .subscribe(tree => {
          // insert the doc to the root of the tree
          tree.push({name: doc.name, id: docId, docId: docId, isDoc: true});
          const treeJson = this.makeJsonTreeFromMemory(tree);
          this.saveOrgTree(treeJson)
            .then(() => resolve(docId))
            .catch(err => reject(err));
        });
    });
  }

  getOrgUserDocAcks$() {
    const org$ = this.getCurrentOrg$();
    const user$ = this.getOrgUser$();

    return org$.switchMap(orgId => {
      return user$.switchMap(user => {
        return this.afs.collection(`org/${orgId}/users/${user.uid}/docsAcks`).valueChanges()
          .map(docAcks => docAcks.filter((docAck: DocAck) => !docAck.hasSigned));
      });
    });
  }

  addReqDocAckToAll(orgId: string, docAckId: string, docAckName: string, docId: string): Promise<any> {
    const requestsToAdd: Array<any> = [];
    return new Promise<any>((resolve) => {

      this.firestoreService.colWithIds$(`org/${orgId}/users`)
        .take(1)
        .subscribe(orgUsers => {
          console.log(orgUsers);
          orgUsers.forEach(orgUser => {
            this.afs.collection('org').doc(orgId).collection('users').doc(orgUser.id).collection('docsAcks').doc(docAckId)
              .valueChanges()
              .take(1)
              .subscribe((docAck: any) => {
                if (!docAck || (docAck && !docAck.isRequired)) {
                  requestsToAdd.push(this.orgDocService.addOrgUserReqDocAck(orgId, docAckId, docAckName, docId, orgUser.id, orgUser.displayName));
                }
              });
          });
          Promise.all(requestsToAdd)
            .then(resolve);
        });
    });
  }

  removeReqDocAckFromAll(orgId: string, docAckId: string): Promise<any> {
    const requestsToRemove: Array<any> = [];
    return new Promise<any>((resolve) => {

      this.firestoreService.colWithIds$(`org/${orgId}/docsAcks/${docAckId}/users`)
        .take(1)
        .subscribe(docAckUsers => {
          console.log(docAckUsers);
          docAckUsers.forEach(docAckUser => {
            if (!docAckUser.hasSigned) {
              requestsToRemove.push(this.orgDocService.removeOrgUserReqDocAck(orgId, docAckId, docAckUser.id));
            }
          });
          Promise.all(requestsToRemove)
            .then(resolve);
        });
    });
  }

}

