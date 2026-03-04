import { query, form, getRequestEvent } from "$app/server";
import { z } from "zod/v4";
import { checkAdminAuth } from "../authorization.remote";

const merchFiltersSchema = z.object({
  query: z.string().optional(),
  active: z.string().optional(),
  page: z.number().optional(),
});

export const getMerchProducts = query(merchFiltersSchema, async (filters) => {
  checkAdminAuth();
  const { locals } = getRequestEvent();

  const { products, count } = locals.merchProductService.getAllProducts({
    active: filters.active === "true" ? true : filters.active === "false" ? false : undefined,
    limit: 25,
    offset: ((filters.page || 1) - 1) * 25,
  });

  return {
    products,
    pagination: {
      count,
      perPage: 25,
      currentPage: filters.page || 1,
    },
  };
});

const productIdSchema = z.object({
  id: z.string(),
});

export const getMerchProduct = query(productIdSchema, async ({ id }) => {
  checkAdminAuth();
  const { locals } = getRequestEvent();
  return locals.merchProductService.getProductById(id);
});

/**
 * Generate the cross-product of all variant option values.
 * E.g. [{name:"Size",values:["S","M"]},{name:"Color",values:["Black","White"]}]
 * → [{Size:"S",Color:"Black"},{Size:"S",Color:"White"},{Size:"M",Color:"Black"},{Size:"M",Color:"White"}]
 */
function generateVariantCombinations(
  variantOptions: Array<{ name: string; values: string[] }>,
): Array<{ label: string; option_values: Record<string, string> }> {
  if (variantOptions.length === 0) return [];

  let combos: Array<Record<string, string>> = [{}];
  for (const opt of variantOptions) {
    const next: Array<Record<string, string>> = [];
    for (const combo of combos) {
      for (const value of opt.values) {
        next.push({ ...combo, [opt.name]: value });
      }
    }
    combos = next;
  }

  return combos.map((option_values) => ({
    label: Object.values(option_values).join(" / "),
    option_values,
  }));
}

function parsePriceCents(priceStr: string): number | null {
  const cents = Math.round(parseFloat(priceStr) * 100);
  if (isNaN(cents) || cents < 1) return null;
  return cents;
}

function parseJsonField<T>(value: string): { ok: true; data: T } | { ok: false } {
  try {
    return { ok: true, data: JSON.parse(value) };
  } catch {
    return { ok: false };
  }
}

// --- Product CRUD ---

export const createMerchProduct = form(
  z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().default(""),
    base_price: z.string().min(1, "Price is required"),
    images: z.string().default(""),
    variant_options: z.string().default(""),
    variant_metadata: z.string().default(""),
    marketing_features: z.string().default(""),
    size_guide: z.string().default(""),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    try {
      const priceCents = parsePriceCents(data.base_price);
      if (!priceCents) {
        return { success: false as const, text: "Please enter a valid price" };
      }

      const images = data.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      let variant_options: Array<{ name: string; values: string[] }> | undefined;
      if (data.variant_options.trim()) {
        const parsed = parseJsonField<Array<{ name: string; values: string[] }>>(
          data.variant_options,
        );
        if (!parsed.ok) return { success: false as const, text: "Invalid variant options JSON" };
        variant_options = parsed.data;
      }

      let marketing_features: string[] | undefined;
      if (data.marketing_features.trim()) {
        const parsed = parseJsonField<string[]>(data.marketing_features);
        if (!parsed.ok) return { success: false as const, text: "Invalid marketing features JSON" };
        marketing_features = parsed.data;
      }

      let size_guide: { headers: string[]; rows: string[][] } | null = null;
      if (data.size_guide.trim()) {
        const parsed = parseJsonField<{ headers: string[]; rows: string[][] }>(data.size_guide);
        if (!parsed.ok) return { success: false as const, text: "Invalid size guide JSON" };
        size_guide = parsed.data;
      }

      const existing = locals.merchProductService.getProductBySlug(data.slug);
      if (existing) {
        return { success: false as const, text: "A product with this slug already exists" };
      }

      const product = await locals.merchProductService.createProduct({
        title: data.title,
        slug: data.slug,
        description: data.description || undefined,
        base_price_cents: priceCents,
        images: images.length > 0 ? images : undefined,
        marketing_features,
        variant_options,
        size_guide,
      });

      // Parse per-variant metadata (SKU, Styria code) keyed by label
      let metaMap: Record<string, { sku?: string; styria_product_code?: string }> = {};
      if (data.variant_metadata.trim()) {
        const parsed = parseJsonField<typeof metaMap>(data.variant_metadata);
        if (parsed.ok) metaMap = parsed.data;
      }

      // Auto-generate variants from variant_options
      let variantsCreated = 0;
      if (variant_options && variant_options.length > 0) {
        const combinations = generateVariantCombinations(variant_options);
        for (const combo of combinations) {
          const meta = metaMap[combo.label];
          await locals.merchProductService.createVariant(product.id, {
            label: combo.label,
            option_values: combo.option_values,
            price_cents: priceCents,
            sku: meta?.sku || undefined,
            styria_product_code: meta?.styria_product_code || undefined,
          });
          variantsCreated++;
        }
      }

      return {
        success: true as const,
        text:
          variantsCreated > 0
            ? `Product created with ${variantsCreated} variants`
            : "Product created",
        productId: product.id,
      };
    } catch (error) {
      console.error("Error creating product:", error);
      return { success: false as const, text: "Failed to create product" };
    }
  },
);

export const updateMerchProduct = form(
  z.object({
    id: z.string(),
    title: z.string().default(""),
    description: z.string().default(""),
    base_price: z.string().default(""),
    images: z.string().default(""),
    marketing_features: z.string().default(""),
    size_guide: z.string().default(""),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    try {
      const updates: Record<string, unknown> = {};

      if (data.title) updates.title = data.title;
      if (data.description !== undefined) updates.description = data.description;

      if (data.base_price) {
        const priceCents = parsePriceCents(data.base_price);
        if (!priceCents) return { success: false as const, text: "Invalid price" };
        updates.base_price_cents = priceCents;
      }

      if (data.images !== undefined) {
        updates.images = data.images
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean);
      }

      if (data.marketing_features.trim()) {
        const parsed = parseJsonField<string[]>(data.marketing_features);
        if (!parsed.ok) return { success: false as const, text: "Invalid marketing features JSON" };
        updates.marketing_features = parsed.data;
      } else {
        updates.marketing_features = [];
      }

      if (data.size_guide.trim()) {
        const parsed = parseJsonField<{ headers: string[]; rows: string[][] }>(data.size_guide);
        if (!parsed.ok) return { success: false as const, text: "Invalid size guide JSON" };
        updates.size_guide = parsed.data;
      } else {
        updates.size_guide = null;
      }

      const product = await locals.merchProductService.updateProduct(data.id, updates);
      if (!product) {
        return { success: false as const, text: "Product not found" };
      }

      return { success: true as const, text: "Product updated" };
    } catch (error) {
      console.error("Error updating product:", error);
      return { success: false as const, text: "Failed to update product" };
    }
  },
);

export const toggleProductActive = form(
  z.object({
    id: z.string(),
    active: z.string(),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    await locals.merchProductService.updateProduct(data.id, { active: data.active === "true" });
  },
);

// --- Variant CRUD ---

export const createVariant = form(
  z.object({
    product_id: z.string(),
    label: z.string().default(""),
    option_values: z.string().default(""),
    price: z.string().default(""),
    sku: z.string().default(""),
    styria_product_code: z.string().default(""),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    try {
      let optionValues: Record<string, string> = {};
      if (data.option_values.trim()) {
        const parsed = parseJsonField<Record<string, string>>(data.option_values);
        if (!parsed.ok) return { success: false as const, text: "Invalid option values JSON" };
        optionValues = parsed.data;
      }

      const product = locals.merchProductService.getProductById(data.product_id);
      if (!product) {
        return { success: false as const, text: "Product not found" };
      }

      // Derive label from option_values if not provided
      const label =
        data.label.trim() || Object.values(optionValues).filter(Boolean).join(" / ") || "Variant";

      const priceCents = data.price ? parsePriceCents(data.price) : product.base_price_cents;

      const variant = await locals.merchProductService.createVariant(data.product_id, {
        label,
        option_values: optionValues,
        price_cents: priceCents || product.base_price_cents,
        sku: data.sku || undefined,
        styria_product_code: data.styria_product_code || undefined,
      });

      return { success: true as const, text: "Variant created", variantId: variant.id };
    } catch (error) {
      console.error("Error creating variant:", error);
      return { success: false as const, text: "Failed to create variant" };
    }
  },
);

export const updateVariant = form(
  z.object({
    id: z.string(),
    product_id: z.string(),
    sku: z.string().default(""),
    styria_product_code: z.string().default(""),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    try {
      const variant = await locals.merchProductService.updateVariant(data.id, {
        sku: data.sku || undefined,
        styria_product_code: data.styria_product_code || undefined,
      });
      if (!variant) {
        return { success: false as const, text: "Variant not found" };
      }

      return { success: true as const, text: "Variant updated" };
    } catch (error) {
      console.error("Error updating variant:", error);
      return { success: false as const, text: "Failed to update variant" };
    }
  },
);

export const deleteVariant = form(
  z.object({
    id: z.string(),
    product_id: z.string(),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    await locals.merchProductService.deleteVariant(data.id);
  },
);

export const generateVariants = form(
  z.object({
    product_id: z.string(),
  }),
  async (data) => {
    checkAdminAuth();
    const { locals } = getRequestEvent();

    try {
      const product = locals.merchProductService.getProductById(data.product_id);
      if (!product) {
        return { success: false as const, text: "Product not found" };
      }
      if (!product.variant_options || product.variant_options.length === 0) {
        return { success: false as const, text: "No variant options defined on this product" };
      }

      const combinations = generateVariantCombinations(product.variant_options);

      const existingVariants = product.variants || [];
      const existingLabels = new Set(existingVariants.map((v) => v.label));

      let created = 0;
      for (const combo of combinations) {
        if (existingLabels.has(combo.label)) continue;

        await locals.merchProductService.createVariant(data.product_id, {
          label: combo.label,
          option_values: combo.option_values,
          price_cents: product.base_price_cents,
        });
        created++;
      }

      if (created === 0) {
        return { success: true as const, text: "All variants already exist" };
      }
      return { success: true as const, text: `Generated ${created} new variants` };
    } catch (error) {
      console.error("Error generating variants:", error);
      return { success: false as const, text: "Failed to generate variants" };
    }
  },
);
