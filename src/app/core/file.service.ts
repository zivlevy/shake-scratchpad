import { Injectable } from '@angular/core';
import {InviteRecord} from '../views/organization/org-admin-users-invite/org-admin-users-invite.component';
import {reject} from "q";

@Injectable()
export class FileService {

  constructor() { }

  readCsv(fileName ) {

    return new Promise((resolve, reject) => {
      const lines = [];

      const reader: FileReader = new FileReader();

      reader.readAsText(fileName);
      reader.onload = (e) => {
        const csv: string = reader.result;
        const allTextLines = csv.split(/\r|\n|\r/);
        const headers = allTextLines[0].split(',');

        for (let i = 0; i < allTextLines.length; i++) {
          // split content based on comma
          const data = allTextLines[i].split(',');
          if (data.length === headers.length) {
            const elements: Array<string> = new Array<string>();

            for (let j = 0; j < headers.length; j++) {
              elements.push(data[j]);
            }

            lines.push(elements);
          }
        }

      };
      reader.onloadend = (e) => {
        resolve(lines);
      };
    });

    // return lines;

  }

  stringToBoolean(string){
    switch (string.toLowerCase().trim()){
      case 'true': case 'yes': case '1': return true;
      case 'false': case 'no': case '0': case null: return false;
      default: return false;
    }
  }

}
