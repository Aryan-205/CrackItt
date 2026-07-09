import { db } from "./db";
import {
  VAULT_PATH,
  buildVaultArticles,
  copyVaultImages,
  writeCurriculumJson,
} from "./vault";

/**
 * Replaces `learn_articles` with the Obsidian vault's contents, copies the
 * embedded screenshots into the web app, and regenerates the sidebar manifest.
 *
 * Only touches Learn content — questions, blogs, tutorials and community data
 * are left alone.
 */
export async function importVault(): Promise<number> {
  console.log(`Reading vault from ${VAULT_PATH}`);
  const { articles, usedImages } = buildVaultArticles();

  const copied = copyVaultImages(usedImages);
  console.log(`Copied ${copied}/${usedImages.size} embedded images`);

  const jsonPath = writeCurriculumJson();
  console.log(`Wrote curriculum manifest to ${jsonPath}`);

  await db.transaction().execute(async (trx) => {
    await trx.deleteFrom("learn_articles").execute();
    await trx.insertInto("learn_articles").values(articles).execute();
  });

  const byCategory = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.category_slug] = (acc[a.category_slug] ?? 0) + 1;
    return acc;
  }, {});
  console.log(`Imported ${articles.length} learn articles:`, byCategory);

  return articles.length;
}
