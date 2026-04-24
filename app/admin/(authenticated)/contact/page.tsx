import { ContactPageForm } from '@/components/admin/ContactPageForm';
import { getContactPageContent } from '@/lib/dashboard';

export const revalidate = 0;

export default async function AdminContactPage() {
  const content = await getContactPageContent();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Contact Us Page</h1>
        <p className="text-muted-foreground">Manage all content shown on the public Contact page.</p>
      </div>

      <ContactPageForm initialContent={content} />
    </div>
  );
}
