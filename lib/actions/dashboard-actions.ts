'use server';

/**
 * lib/actions/dashboard-actions.ts — Admin Server Actions
 *
 * This file acts as a secure bridge between the Client UI (ArticleForm, ArticleTable)
 * and the high-authority Admin SDK logic in lib/dashboard.ts.
 *
 * Marking this with 'use server' ensures these functions only ever run 
 * on the server, preventing Node.js-only modules (child_process, fs) 
 * from being bundled into your browser package.
 */

import { 
  createArticle, 
  createAuthor,
  createVisualStory,
  deleteCategory,
  deleteAuthor,
  deleteVisualStory,
  getArticleById,
  getVisualStoryById,
  updateArticle,
  updateAuthor,
  updateVisualStory,
  deleteArticle,
  getCategories,
  getAboutPageContent,
  getAuthors,
  upsertAboutPageContent,
  getContactPageContent,
  upsertContactPageContent,
  createCategory,
  updateCategory
} from '@/lib/dashboard';
import { AboutPageContent, ContactPageContent, Article, Author, Category, VisualStory } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { revalidatePath } from 'next/cache';

function normalizeCategorySlug(input?: string): string | null {
  if (!input) return null;

  const cleaned = input
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/^category\//, '');

  return cleaned || null;
}

function resolveCategorySlug(article?: Partial<Article> | null): string | null {
  const explicit = normalizeCategorySlug(article?.categorySlug);
  if (explicit) return explicit;

  if (article?.category) {
    const derived = slugify(article.category);
    return derived || null;
  }

  return null;
}

function revalidatePublicArticlePaths(categorySlug?: string | null) {
  revalidatePath('/');
  revalidatePath('/latest');

  // Invalidate all dynamic article and category pages
  revalidatePath('/article/[slug]', 'page');
  revalidatePath('/category/[slug]', 'page');

  // Also invalidate the specific selected category page immediately
  if (categorySlug) {
    revalidatePath(`/category/${categorySlug}`);
  }
}

function revalidateVisualStoryPaths(slug?: string) {
  revalidatePath('/admin/stories');
  revalidatePath('/admin/stories/new');
  revalidatePath('/admin/stories/[id]/edit', 'page');
  revalidatePath('/visual-stories');
  revalidatePath('/visual-stories/[slug]', 'page');
  revalidatePath('/');

  if (slug) {
    revalidatePath(`/visual-stories/${slug}`);
  }
}

/**
 * Super-secure admin-based file upload — saves to public/uploads/ on disk.
 * Files are served as static Next.js assets at /uploads/{folder}/{filename}.
 */
export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    const folder = (formData.get('folder') as string | null)?.trim() || 'articles';
    const buffer = Buffer.from(await file.arrayBuffer());

    const { default: cloudinary } = await import('@/lib/cloudinary');

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `drishyam/${folder}`,
          resource_type: 'auto', // Handles images or videos
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    }) as any;

    return { success: true, url: result.secure_url };
  } catch (err) {
    console.error('[Dashboard Action] Cloudinary Upload failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Upload failed' };
  }
}


/**
 * Persists a new article to Firestore using the Admin SDK.
 */
export async function createArticleAction(
  data: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'views'>
) {
  try {
    const newArticle = await createArticle(data);
    const categorySlug = resolveCategorySlug(newArticle) || resolveCategorySlug(data);

    revalidatePath('/admin/articles');
    revalidatePublicArticlePaths(categorySlug);

    return { success: true, data: newArticle };
  } catch (err) {
    console.error('[Dashboard Action] Create failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Updates an existing article in Firestore.
 */
export async function updateArticleAction(id: string, data: Partial<Article>) {
  try {
    const previousArticle = await getArticleById(id);
    const updated = await updateArticle(id, data);

    const previousCategorySlug = resolveCategorySlug(previousArticle);
    const nextCategorySlug = resolveCategorySlug(updated) || resolveCategorySlug(data);

    revalidatePath('/admin/articles');
    revalidatePath(`/admin/articles/${id}/edit`);
    revalidatePublicArticlePaths(nextCategorySlug);

    // If category changed, invalidate the old category listing too.
    if (previousCategorySlug && previousCategorySlug !== nextCategorySlug) {
      revalidatePath(`/category/${previousCategorySlug}`);
    }

    return { success: true, data: updated };
  } catch (err) {
    console.error('[Dashboard Action] Update failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Deletes an article from Firestore.
 */
export async function deleteArticleAction(id: string) {
  try {
    const existingArticle = await getArticleById(id);

    await deleteArticle(id);

    revalidatePath('/admin/articles');
    revalidatePublicArticlePaths(resolveCategorySlug(existingArticle));

    return { success: true };
  } catch (err) {
    console.error('[Dashboard Action] Delete failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Fetches categories for client components (Selects)
 */
export async function getCategoriesAction() {
  return await getCategories();
}

/**
 * Fetches authors for client components (Selects)
 */
export async function getAuthorsAction() {
  return await getAuthors();
}

/**
 * Persists a new author
 */
export async function createAuthorAction(data: Omit<Author, 'id'>) {
  try {
    const newAuthor = await createAuthor(data);
    revalidatePath('/admin/authors');
    revalidatePath('/admin/articles/new');
    revalidatePath('/admin/articles/[id]/edit', 'page');
    return { success: true, data: newAuthor };
  } catch (err) {
    console.error('[Dashboard Action] Author Create failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Updates an author
 */
export async function updateAuthorAction(id: string, data: Partial<Author>) {
  try {
    const updated = await updateAuthor(id, data);
    revalidatePath('/admin/authors');
    revalidatePath('/admin/articles/new');
    revalidatePath('/admin/articles/[id]/edit', 'page');
    revalidatePath('/article/[slug]', 'page');
    return { success: true, data: updated };
  } catch (err) {
    console.error('[Dashboard Action] Author Update failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Deletes an author
 */
export async function deleteAuthorAction(id: string) {
  try {
    await deleteAuthor(id);
    revalidatePath('/admin/authors');
    revalidatePath('/admin/articles/new');
    revalidatePath('/admin/articles/[id]/edit', 'page');
    return { success: true };
  } catch (err) {
    console.error('[Dashboard Action] Author Delete failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Persists a new visual story
 */
export async function createVisualStoryAction(data: Omit<VisualStory, 'id' | 'createdAt'>) {
  try {
    const created = await createVisualStory(data);
    revalidateVisualStoryPaths(created.slug || data.slug);
    return { success: true, data: created };
  } catch (err) {
    console.error('[Dashboard Action] Visual Story Create failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Updates an existing visual story
 */
export async function updateVisualStoryAction(id: string, data: Partial<VisualStory>) {
  try {
    const previous = await getVisualStoryById(id);
    const updated = await updateVisualStory(id, data);
    revalidateVisualStoryPaths(updated.slug || data.slug || previous?.slug);

    // Invalidate old slug page when slug changes
    if (previous?.slug && updated.slug && previous.slug !== updated.slug) {
      revalidatePath(`/visual-stories/${previous.slug}`);
    }

    return { success: true, data: updated };
  } catch (err) {
    console.error('[Dashboard Action] Visual Story Update failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Deletes a visual story
 */
export async function deleteVisualStoryAction(id: string) {
  try {
    const existing = await getVisualStoryById(id);
    await deleteVisualStory(id);
    revalidateVisualStoryPaths(existing?.slug);
    return { success: true };
  } catch (err) {
    console.error('[Dashboard Action] Visual Story Delete failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Fetches About Us page content for admin editor
 */
export async function getAboutPageContentAction() {
  return await getAboutPageContent();
}

/**
 * Upserts About Us page content
 */
export async function updateAboutPageContentAction(data: Partial<AboutPageContent>) {
  try {
    const updated = await upsertAboutPageContent(data);
    revalidatePath('/about');
    revalidatePath('/admin/about');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err) {
    console.error('[Dashboard Action] About Page Update failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Fetches Contact Us page content for admin editor
 */
export async function getContactPageContentAction() {
  return await getContactPageContent();
}

/**
 * Upserts Contact Us page content
 */
export async function updateContactPageContentAction(data: Partial<ContactPageContent>) {
  try {
    const updated = await upsertContactPageContent(data);
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err) {
    console.error('[Dashboard Action] Contact Page Update failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Persists a new category
 */
export async function createCategoryAction(data: Omit<Category, 'id' | 'order'> & { order: number }) {
  try {
    const newCategory = await createCategory(data);
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data: newCategory };
  } catch (err) {
    console.error('[Dashboard Action] Category Create failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Updates a category
 */
export async function updateCategoryAction(id: string, data: Partial<Category>) {
  try {
    const updated = await updateCategory(id, data);
    revalidatePath('/admin/categories');
    revalidatePath('/');
    return { success: true, data: updated };
  } catch (err) {
    console.error('[Dashboard Action] Category Update failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

/**
 * Deletes a category
 */
export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory(id);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/articles/new');
    revalidatePath('/admin/articles/[id]/edit', 'page');
    revalidatePath('/category/[slug]', 'page');
    revalidatePath('/');
    return { success: true };
  } catch (err) {
    console.error('[Dashboard Action] Category Delete failed:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
