import { mock } from "node:test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { repositoryMocks } from "./helpers/repositoryMocks";

const mockRepository = (relativePath: string, exports: object) => {
  const repositoryPath = resolve(__dirname, relativePath);
  const modulePath = existsSync(`${repositoryPath}.js`)
    ? `${repositoryPath}.js`
    : `${repositoryPath}.ts`;

  mock.module(pathToFileURL(modulePath), {
    exports,
    cache: true,
  });
};

mockRepository("../src/modules/users/users.repository", repositoryMocks.users);
mockRepository("../src/modules/genres/genres.repository", repositoryMocks.genres);
mockRepository("../src/modules/producers/producers.repository", repositoryMocks.producers);
