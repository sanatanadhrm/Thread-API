/* istanbul ignore file */

const { createContainer } = require('instances-container')

// external agency
const { nanoid } = require('nanoid')
const bcrypt = require('bcrypt')
const Jwt = require('@hapi/jwt')
const pool = require('./database/postgres/pool')

// service (repository, helper, manager, etc)
const PasswordHash = require('../Applications/security/PasswordHash')
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager')
const UserRepository = require('../Domains/users/UserRepository')
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres')
const JwtTokenManager = require('./security/JwtTokenManager')
const BcryptPasswordHash = require('./security/BcryptPasswordHash')
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository')
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres')
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres')
const ThreadRepository = require('../Domains/threads/ThreadRepository')
const ThreadCommentRepository = require('../Domains/threadComments/ThreadCommentRepository')
const ThreadCommentRepositoryPostgres = require('./repository/ThreadCommentRepositoryPostgres')
const RepliesRepositoryPostgres = require('./repository/RepliesRepositoryPostgres')
const RepliesRepository = require('../Domains/replies/RepliesRepository')
const LikeCommentRepositoryPostgres = require('./repository/LikeCommentRepositoryPostgres')
const LikeCommentsRepository = require('../Domains/likesComments/LikesCommentRepository')

// use case
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase')
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase')
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase')
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase')
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase')
const AddThreadCommentUseCase = require('../Applications/use_case/AddThreadCommentUseCase')
const DeleteThreadCommentUseCase = require('../Applications/use_case/DeleteThreadCommenUseCase')
const GetDetailThreadUseCase = require('../Applications/use_case/GetDetailThreadUseCase')
const AddRepliesUseCase = require('../Applications/use_case/AddRepliesUseCase')
const DeleteRepliesUseCase = require('../Applications/use_case/DeleteRepliesUseCase')
const LikeCommentUseCase = require('../Applications/use_case/LikeCommentUseCase')

// creating container
const container = createContainer()

// registering services and repository
container.register([
  {
    key: LikeCommentsRepository.name,
    Class: LikeCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: RepliesRepository.name,
    Class: RepliesRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ThreadCommentRepository.name,
    Class: ThreadCommentRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: ThreadRepository.name,
    Class: ThreadRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        },
        {
          concrete: nanoid
        }
      ]
    }
  },
  {
    key: AuthenticationRepository.name,
    Class: AuthenticationRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool
        }
      ]
    }
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt
        }
      ]
    }
  },
  {
    key: AuthenticationTokenManager.name,
    Class: JwtTokenManager,
    parameter: {
      dependencies: [
        {
          concrete: Jwt.token
        }
      ]
    }
  }
])

// registering use cases
container.register([
  {
    key: LikeCommentUseCase.name,
    Class: LikeCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'likeCommentRepository',
          internal: LikeCommentsRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  },
  {
    key: DeleteRepliesUseCase.name,
    Class: DeleteRepliesUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        }
      ]
    }
  },
  {
    key: AddRepliesUseCase.name,
    Class: AddRepliesUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        }
      ]
    }
  },
  {
    key: GetDetailThreadUseCase.name,
    Class: GetDetailThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'repliesRepository',
          internal: RepliesRepository.name
        },
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: DeleteThreadCommentUseCase.name,
    Class: DeleteThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        }
      ]
    }
  },
  {
    key: AddThreadCommentUseCase.name,
    Class: AddThreadCommentUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadCommentRepository',
          internal: ThreadCommentRepository.name
        },
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: AddThreadUseCase.name,
    Class: AddThreadUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'threadRepository',
          internal: ThreadRepository.name
        }
      ]
    }
  },
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LoginUserUseCase.name,
    Class: LoginUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'userRepository',
          internal: UserRepository.name
        },
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        },
        {
          name: 'passwordHash',
          internal: PasswordHash.name
        }
      ]
    }
  },
  {
    key: LogoutUserUseCase.name,
    Class: LogoutUserUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        }
      ]
    }
  },
  {
    key: RefreshAuthenticationUseCase.name,
    Class: RefreshAuthenticationUseCase,
    parameter: {
      injectType: 'destructuring',
      dependencies: [
        {
          name: 'authenticationRepository',
          internal: AuthenticationRepository.name
        },
        {
          name: 'authenticationTokenManager',
          internal: AuthenticationTokenManager.name
        }
      ]
    }
  }
])

module.exports = container
