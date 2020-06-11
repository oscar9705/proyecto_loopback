// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: loopback4-example-shopping
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {AuthorizationContext, AuthorizationDecision, AuthorizationMetadata} from '@loopback/authorization';
import {securityId, UserProfile} from '@loopback/security';
import _ from 'lodash';

// Instance level authorizer
// Can be also registered as an authorizer, depends on users' need.
export async function basicAuthorization(
  authorizationCtx: AuthorizationContext,
  metadata: AuthorizationMetadata,
): Promise<AuthorizationDecision> {
  // No access if authorization details are missing
  let currentUser: UserProfile;
  if (authorizationCtx.principals.length > 0) {
    console.log("1");
    const user = _.pick(authorizationCtx.principals[0], [
      'id',
      'name',
      'roles'

    ]);
    console.log(user);
    /* const userId = authorizationCtx.principals[0][securityId]; */
    currentUser = {
      [securityId]: user.id, name: user.name, roles: user.roles
    };
    console.log("prueba1");
    console.log(currentUser);
    /* console.log(authorizationCtx.principals[0][securityId]); */
  } else {
    console.log("2");
    return AuthorizationDecision.DENY;
  }

  if (!currentUser.roles) {
    console.log("prueba");
    console
    console.log("3");
    return AuthorizationDecision.DENY;
  }

  // Authorize everything that does not have a allowedRoles property
  if (!metadata.allowedRoles) {
    console.log("4");
    return AuthorizationDecision.ALLOW;
  }

  let roleIsAllowed = false;
  for (const role of currentUser.roles) {
    if (metadata.allowedRoles!.includes(role)) {
      console.log("5");
      roleIsAllowed = true;
      break;
    }
  }

  if (!roleIsAllowed) {
    console.log("6");
    return AuthorizationDecision.DENY;
  }

  // Admin and support accounts bypass id verification
  if (
    currentUser.roles.includes('admin') ||
    currentUser.roles.includes('support')
  ) {
    console.log("7");
    return AuthorizationDecision.ALLOW;
  }

  /**
   * Allow access only to model owners, using route as source of truth
   *
   * eg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]
   */
  if (currentUser[securityId] === authorizationCtx.invocationContext.args[0]) {
    console.log(authorizationCtx.invocationContext.args[0]);
    console.log("8");
    console.log("Allow access only to model owners, using route as source of trutheg. @post('/users/{userId}/orders', ...) returns `userId` as args[0]");
    return AuthorizationDecision.ALLOW;
  }

  return AuthorizationDecision.DENY;
}
