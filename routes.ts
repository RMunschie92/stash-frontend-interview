import {
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/", "./src/layouts/index.tsx"),
  // pattern ^           ^ module file
] satisfies RouteConfig;
