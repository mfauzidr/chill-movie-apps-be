export const repositoryCalls = {
  users: { findExistingEmail: 0, insert: 0 },
};

export const repositoryMocks = (() => {
  const users = {
    findAll: async () => [],
    findByUuid: async () => [],
    insert: async () => {
      repositoryCalls.users.insert += 1;
      return [{
        uuid: "test-user-uuid",
        username: "Test User",
        email: "test@example.com",
        role: "user",
        image: null,
        is_active: true,
      }];
    },
    update: async () => [],
    deleteUser: async () => 0,
    findExistingEmail: async () => {
      repositoryCalls.users.findExistingEmail += 1;
      return [];
    },
  };

  const genres = {
    findAll: async () => [],
    findById: async () => [],
    insert: async () => [],
    update: async () => [],
    deleteGenre: async () => 0,
    findExistingGenre: async () => [],
  };

  const producers = {
    findAll: async () => [],
    findById: async () => [],
    insert: async () => [],
    update: async () => [],
    deleteProducer: async () => 0,
    findExistingProducer: async () => [],
  };

  return { users, genres, producers };
})();
