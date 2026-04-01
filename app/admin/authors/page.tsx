import { getAuthors, getAllArticles } from '@/lib/dashboard';
import Image from 'next/image';

export const revalidate = 0;

export default async function AuthorsPage() {
  const authors = await getAuthors();
  const allArticles = await getAllArticles();

  // Create map of author contributions
  const authorCounts = allArticles.reduce((acc, article) => {
    acc[article.authorId] = (acc[article.authorId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Authors</h1>
          <p className="text-muted-foreground">Manage the editorial team and contributor profiles.</p>
        </div>
        <button className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-sm hover:bg-primary/90 transition-colors shadow-sm">
          + Add Author
        </button>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="py-4 px-6 font-semibold">Author</th>
              <th className="py-4 px-6 font-semibold">Contact / Bio</th>
              <th className="py-4 px-6 font-semibold text-center">Published</th>
              <th className="py-4 px-6 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {authors.map((author) => (
              <tr key={author.id} className="hover:bg-secondary/20 transition-colors group">
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 relative overflow-hidden rounded-full bg-secondary border border-border">
                       <Image 
                         src={author.avatar} 
                         alt={author.name} 
                         fill
                         sizes="40px"
                         className="object-cover" 
                       />
                    </div>
                    <div>
                      <div className="font-bold text-foreground">{author.name}</div>
                      <div className="text-xs font-semibold text-primary uppercase tracking-wide mt-0.5">{author.role}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                   <div className="text-sm text-foreground">{author.email}</div>
                   <div className="text-xs text-muted-foreground mt-1 line-clamp-1 max-w-sm">{author.bio}</div>
                </td>
                <td className="py-4 px-6 text-center">
                   <span className="inline-flex items-center justify-center px-2 py-1 bg-secondary text-foreground font-bold rounded-sm text-xs min-w-[2rem] border border-border">
                     {authorCounts[author.id] || 0}
                   </span>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button className="text-primary hover:text-primary/80 font-medium transition-colors text-sm px-2">Edit</button>
                  <button className="text-red-500 hover:text-red-600 font-medium transition-colors text-sm px-2 opacity-50 cursor-not-allowed hidden md:inline-block" title="Disabled in mock mode">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
