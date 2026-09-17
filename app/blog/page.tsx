import Image from "next/image";
import Link from "next/link";
import { ThinBanner } from "@/components/thin-banner";
import { getBlogPosts } from "@/lib/blog-posts";

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <main>
      <ThinBanner title="Blog" />

      <div className="mx-auto max-w-5xl px-6 py-16">
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative aspect-square overflow-hidden bg-section">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <p className="mt-4 font-serif text-lg tracking-wide text-foreground">
                  {post.title}
                </p>
                <p className="mt-2 font-sans text-sm text-foreground/70">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
