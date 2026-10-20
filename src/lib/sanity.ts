import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "h67xdo8v",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});