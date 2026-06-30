export default function generateSearchQuery(search: string | null, additionalKeys: string[] = []) {
  if (!search) return {};

  const keys = ["title", "name", "email", "phone", ...additionalKeys];
  
  return {
    $or: keys.map((key) => ({
      [key]: { $regex: search, $options: "i" },
    })),
  };
}
