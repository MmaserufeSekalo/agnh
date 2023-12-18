
import { PRODUCT_CATEGORIES } from "../../config";
import { CollectionConfig } from "payload/types";




//type annotation lets us know what can be passed in to the function
export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {},
  //table fields
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    //products attributes
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Product details",
    },
    {
      name: "price",
      label: "Price in ZAR",
      min: 0,
      max: 10000,
      type: "number",
      required: true,
    },

    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "sale",
      label: "Is the product on sale?",
      required: true,
      type: "select",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "discount",
      label: "What is the percentage discount?",
      required: true,
      type: "number",
      min: 0,
      max: 100,
    },
    {
      name: "collect",
      label: "Can customers collect this product at your address?",
      required: true,
      type: "select",
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    //verify products:admin
    {
      name: "approvedForSale",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      access: {
        create: ({ req }) => req.user.role === "admin",
        read: ({ req }) => req.user.role === "admin",
        update: ({ req }) => req.user.role === "admin",
      },
      options: [
        {
          label: "Pending verification",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
    },
    {
      name: "priceId",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },

    {
      name: "payStackID",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      type: "text",
      admin: {
        hidden: true,
      },
    },
    {
      name: "images",
      type: "array",
      label: "Product images",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
  ],
};
