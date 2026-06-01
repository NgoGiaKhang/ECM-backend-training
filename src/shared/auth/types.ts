export type PublicRoute = {
  path: string; // supports wildcard
  methods?: ReadonlyArray<"GET" | "POST" | "PUT" | "PATCH" | "DELETE">;
};
