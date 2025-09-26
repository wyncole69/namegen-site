// app/api/random-people/route.ts
function cap(s: string) {
  return s ? s[0].toUpperCase() + s.slice(1).toLowerCase() : s;
}

export async function GET() {
  const res = await fetch("https://randomuser.me/api/?results=10", {
    cache: "no-store",
  });
  const data = await res.json();

  const names: string[] = (data.results || []).map((p: any) =>
    `${cap(p.name.first)} ${cap(p.name.last)}`
  );

  return Response.json({ names });
}
