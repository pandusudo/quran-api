import { createCache } from "cache-manager";

const cache = createCache({
  ttl: 1000 * 60 * 60, // 1 hour
});

export default cache;
