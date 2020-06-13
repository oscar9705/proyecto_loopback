import {Entity, hasMany, model, property} from '@loopback/repository';
import {Articulo} from '.';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  firstname: string;

  @property({
    type: 'string',
    required: true,
  })
  lastname: string;

  @property({
    type: 'string',
  })
  codigo?: string;

  @property({
    type: 'array',
    itemType: 'string',
  })
  roles?: string[];

  @hasMany(() => Articulo, {keyTo: 'usuarioId'})
  articulos?: Articulo[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
