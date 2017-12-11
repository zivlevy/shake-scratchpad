

export interface Organization {
    id?: string;                    // DB id
    name: string;

    createdBy?: string;              // uid
    creationDate?: number;

    allowPublicAccess?: boolean;

    language?: string;                   // Determines language and page direction for all pages viewed by organization
    logo?: object;
    jumbotron?: object;

}
