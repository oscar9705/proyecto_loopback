import {DefaultCrudRepository} from '@loopback/repository';
import {Articulo, ArticuloRelations} from '../models';
import {MysqlDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ArticuloRepository extends DefaultCrudRepository<
  Articulo,
  typeof Articulo.prototype.id,
  ArticuloRelations
> {
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
  ) {
    super(Articulo, dataSource);
  }
}
