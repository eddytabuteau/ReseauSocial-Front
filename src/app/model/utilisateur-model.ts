export class User {
    constructor(
      public firstName: string,
      public lastName: string,
      public email: string,
      public age: number,
      public gender: string,
      public nationality: string,
      public presentation: string,
      public pseudo: string,
      public password: string,
      public droit: number,
      public listeUser: [{}],
      public discussion: [{}],
      public messageProfil: [{}],
      public connexion: boolean,
      public socketId: string,
      public idChat: [{}],

    ) {}
  }