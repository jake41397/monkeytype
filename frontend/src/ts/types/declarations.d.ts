declare module "wordnet" {
  export function init(): Promise<void>;
  export function list(): Promise<string[]>;
  export function lookup(
    word: string,
    skipPointers?: boolean
  ): Promise<{ meta: { synsetType: string }; glossary: string }[]>;
}
