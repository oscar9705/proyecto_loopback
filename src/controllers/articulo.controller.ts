import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Articulo} from '../models';
import {ArticuloRepository} from '../repositories';
import {basicAuthorization} from '../services/basic.authorizor';
import {OPERATION_SECURITY_SPEC} from '../utils/security-spec';

export class ArticuloController {
  constructor(
    @repository(ArticuloRepository)
    public articuloRepository: ArticuloRepository,
  ) {}

  @post('/articulos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Articulo model instance',
        content: {'application/json': {schema: getModelSchemaRef(Articulo)}},
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'support', 'customer'],
    voters: [basicAuthorization],
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Articulo, {
            title: 'NewArticulo',
            exclude: ['id', 'usuarioId'],
          }),
        },
      },
    })
    articulo: Omit<Articulo, 'id'>, @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<Articulo> {
    /* currentUserProfile.id = currentUserProfile[securityId]; */
    articulo.usuarioId = currentUserProfile[securityId];
    return this.articuloRepository.create(articulo);
  }

  @get('/articulos/count', {
    responses: {
      '200': {
        description: 'Articulo model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Articulo) where?: Where<Articulo>,
  ): Promise<Count> {
    return this.articuloRepository.count(where);
  }

  @get('/articulos', {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'Array of Articulo model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Articulo, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Articulo) filter?: Filter<Articulo>,
  ): Promise<Articulo[]> {
    return this.articuloRepository.find(filter);
  }

  @patch('/articulos', {
    responses: {
      '200': {
        description: 'Articulo PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Articulo, {partial: true}),
        },
      },
    })
    articulo: Articulo,
    @param.where(Articulo) where?: Where<Articulo>,
  ): Promise<Count> {
    return this.articuloRepository.updateAll(articulo, where);
  }

  @get('/articulos/{id}', {
    responses: {
      '200': {
        description: 'Articulo model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Articulo, {includeRelations: true}),
          },
        },
      },
    },
  })
  @authenticate('jwt')
  @authorize({
    allowedRoles: ['admin', 'support', 'customer'],
    voters: [basicAuthorization],
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Articulo, {exclude: 'where'}) filter?: FilterExcludingWhere<Articulo>
  ): Promise<Articulo> {
    return this.articuloRepository.findById(id, filter);
  }

  @patch('/articulos/{id}', {
    responses: {
      '204': {
        description: 'Articulo PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Articulo, {partial: true}),
        },
      },
    })
    articulo: Articulo,
  ): Promise<void> {
    await this.articuloRepository.updateById(id, articulo);
  }

  @put('/articulos/{id}', {
    responses: {
      '204': {
        description: 'Articulo PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() articulo: Articulo,
  ): Promise<void> {
    await this.articuloRepository.replaceById(id, articulo);
  }

  @del('/articulos/{id}', {
    responses: {
      '204': {
        description: 'Articulo DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.articuloRepository.deleteById(id);
  }
}
