import { registry } from "@/shared/docs/index.js";
import { ProductSchema } from "./product.schema.js";
import z from "zod";

registry.register("ProductRequest", ProductSchema);

registry.registerPath({
  method: "post",
  path: "/products",
  tags: ["Products"],
  summary: "Crate new product",

  request: {
    body: {
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
  },

  responses: {
    201: {
      description: "Created",
    },
    409: {
      description: "",
    },
  },
});

registry.registerPath({
  method: "get",
  path: "/products/{id}",
  tags: ["Products"],
  summary: "Get product by id",

  request: {},

  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "string" },
              sku: { type: "string" },
              name: { type: "string" },
              slug: { type: "string" },

              description: { type: "string" },

              originalPrice: { type: "number" },
              price: { type: "number" },
              discountPercent: { type: "number" },

              currency: { type: "string" },
              stock: { type: "number" },
              sold: { type: "number" },

              isAvailable: { type: "boolean" },

              rating: { type: "number" },
              reviewCount: { type: "number" },

              categoryId: { type: "string" },
              categoryName: { type: "string" },

              brandName: { type: "string" },
              thumbnail: { type: "string" },

              tags: {
                type: "array",
                items: { type: "string" },
              },

              createdAt: { type: "string" },
              updatedAt: { type: "string" },
            },
            required: [
              "id",
              "sku",
              "name",
              "slug",
              "originalPrice",
              "price",
              "rating",
              "brandName",
              "thumbnail",
            ],
          },
        },
      },
    },

    404: {
      description: "Not found",
    },
  },
});

registry.registerPath({
  method: "put",
  path: "/products/{id}",
  tags: ["Products"],
  summary: "Update product by id",
  request: {
    params: z.object({
      id: z.string("Id is required"),
    }),
    body: {
      content: {
        "application/json": {
          schema: ProductSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: "Ok",
    },
    404: {
      description: "Not found",
    },
  },
});

registry.registerPath({
  method: "delete",
  path: "/products/{id}",
  tags: ["Products"],
  summary: "Delete product",

  request: {
    params: z.object({
      id: z.string("Id is required"),
    }),
  },

  responses: {
    204: {
      description: "Deleted",
    },
    404: {
      description: "Not found",
    },
  },
});
