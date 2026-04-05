import { AboutPageForm } from '@/components/admin/AboutPageForm';
import { getAboutPageContent } from '@/lib/dashboard';

export const revalidate = 0;

export default async function AdminAboutPage() {
  const content = await getAboutPageContent();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">About Us Page</h1>
        <p className="text-muted-foreground">Manage all content shown on the public About page.</p>
      </div>

      <AboutPageForm initialContent={content} />
    </div>
  );
}
