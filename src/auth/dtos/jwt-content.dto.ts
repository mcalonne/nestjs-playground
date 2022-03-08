export enum USER_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export default interface JwtContentDto {
  id: string; // the uuid of the user in db
  role: USER_ROLE;
}
