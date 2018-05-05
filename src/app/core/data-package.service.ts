import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {ImageService} from './image.service';
import {take} from 'rxjs/operators';
@Injectable()
export class DataPackageService {

  constructor(private afs: AngularFirestore,
              private imageService: ImageService) {
  }

  getDataPackageImagesUrl(language: string, sector: string): Promise<any> {

    return new Promise<any>((resolve, reject) => {
      this.afs.doc(`dataPackages/${language}/sectors/${sector}`)
        .valueChanges()
        .pipe(
          take(1)
        ).subscribe((dataPackageDoc: any) => {
        const logoUrlP = this.imageService.getDataPackageLogoUrl$(dataPackageDoc.logoFileName);
        const bannerUrlP = this.imageService.getDataPackageBannerUrl$(dataPackageDoc.bannerFileName);

        Promise.all([logoUrlP, bannerUrlP])
          .then(res => {
            const newData = {
              'logoURL': res[0],
              'bannerURL': res[1]
            };
            resolve(newData);
          });
      });
    });
  }
}
