

export interface Organization {
    id?: string;                    // DB id
    name: string;

    createdBy: string;              // uid
    creationDate: number;

    allowPublicAccess: boolean;

    language: string;                   // Determines language and page direction for all pages viewed by organization
    logo: object;
    jumbotron: object;

    // SkTemplates: SkTemplate[];
    // SkDocuments: SkDocument[];
    // navigationTree: NavigationTree;

    // viewers: Array<string>;             // DB id
    // Editors: Array<string>;             // DB id
    // Admins: Array<string>;             // DB id
    //
    // teams: Array<Team>;


}