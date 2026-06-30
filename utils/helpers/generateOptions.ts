export default function generateOptions(req: any) {
  const searchParams = req.nextUrl.searchParams;
  const page = Number(searchParams.get("page")) || 1;
  const count = Number(searchParams.get("count")) || 10;

  return {
    page: Number(page) || 1,
    limit: Number(count) || 10,
    sort: { createdAt: -1 },
    customLabels: { docs: "data", totalDocs: "totalData" },
  };
}
