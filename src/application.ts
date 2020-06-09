import {AuthenticationComponent} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig, BindingKey, createBindingFromClass} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants, UserServiceBindings} from './keys';
import {MyAuthenticationSequence} from './sequence';
import {BcryptHasher} from './services/hash.password.bcryptjs';
import {JWTService} from './services/jwt-service';
import {MyUserService} from './services/user-service';
import {SECURITY_SCHEME_SPEC, SECURITY_SPEC} from './utils/security-spec';

/**
 * Information from package.json
 */
export interface PackageInfo {
  name: string;
  version: string;
  description: string;
}
export const PackageKey = BindingKey.create<PackageInfo>('application.package');
const pkg: PackageInfo = require('../package.json');

export class ProyectoApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);
    this.api({
      openapi: '3.0.0',
      info: {title: pkg.name, version: pkg.version},
      paths: {},
      components: {securitySchemes: SECURITY_SCHEME_SPEC},
      servers: [{url: '/'}],
      security: SECURITY_SPEC
    });
    this.setUpBindings();
    // Bind authentication component related elements
    this.component(AuthenticationComponent);

    // Set up the custom sequence
    this.sequence(MyAuthenticationSequence);
    // authentication
    this.add(createBindingFromClass(JWTAuthenticationStrategy));

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
  setUpBindings(): void {
    // ...

    this.bind(TokenServiceBindings.TOKEN_SECRET).to(
      TokenServiceConstants.TOKEN_SECRET_VALUE,
    );

    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(
      TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE,
    );
    // Bind bcrypt hash services - utilized by 'UserController' and 'MyUserService'
    this.bind(PasswordHasherBindings.ROUNDS).to(10);
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);

    this.bind(UserServiceBindings.USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService);



  }
}
