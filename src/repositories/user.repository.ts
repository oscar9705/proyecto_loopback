import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {MysqlDataSource} from '../datasources';
import {Articulo, User, UserRelations} from '../models';
import {ArticuloRepository} from './articulo.repository';

export type Credentials = {
  email: string;
  password: string;
};
export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
  > {
  public readonly articulos: HasManyRepositoryFactory<
    Articulo,
    typeof User.prototype.id
  >;
  constructor(
    @inject('datasources.mysql') dataSource: MysqlDataSource,
    @repository.getter('ArticuloRepository')
    protected articuloRepositoryGetter: Getter<ArticuloRepository>
  ) {
    super(User, dataSource);
    this.articulos = this.createHasManyRepositoryFactoryFor('articulos', articuloRepositoryGetter);
    this.registerInclusionResolver('articulos', this.articulos.inclusionResolver);
  }
}
