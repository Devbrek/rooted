import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ThinBanner } from "@/components/thin-banner";
import { getBlogPost, getBlogPosts } from "@/lib/blog-posts";

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <ThinBanner title={post.title} />

      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-16">
        <p className="inline-block self-start border border-accent/30 bg-section px-3 py-1 font-sans text-xs tracking-wide text-foreground/70 uppercase">
          Article fictif
        </p>

        <div className="relative aspect-video w-full overflow-hidden bg-section">
          <Image
            src={post.image}
            alt=""
            fill
            sizes="(min-width: 640px) 672px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          {post.paragraphs.map((paragraph, index) => (
            <p key={index} className="font-sans text-foreground">
              {paragraph}
            </p>
          ))}
        </div>

        <Link
          href="/blog"
          className="self-start text-sm tracking-wide text-secondary uppercase transition-colors hover:text-foreground"
        >
          Retour au blog
        </Link>
      </div>
    </main>
  );
}
