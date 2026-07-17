import { describe, expect, it } from "vitest";
import { getAllMarkdownPosts, getMarkdownPost } from "@/lib/blog-markdown";

describe("published medical billing guides", () => {
  it("keeps the page template as the only H1", async () => {
    for (const post of getAllMarkdownPosts()) {
      const rendered = await getMarkdownPost(post.slug);
      expect(rendered?.htmlContent).not.toMatch(/<h1(?:\s|>)/i);
    }
  });

  it("provides a substantive description for every guide", () => {
    for (const post of getAllMarkdownPosts()) {
      expect(post.description.length).toBeGreaterThanOrEqual(80);
    }
  });
});
