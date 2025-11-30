import { NextRequest, NextResponse } from "next/server";

const baseUrl =
    "https://places-api.arcgis.com/arcgis/rest/services/places-service/v1/places/within-extent";

export async function GET(req: NextRequest) {
  const apiKey = process.env.PRIVATE_ARCGIS_LOCATION_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
        { error: "ArcGIS API key not configured on server" },
        { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);

  const arcgisUrl = new URL(baseUrl);
  arcgisUrl.searchParams.set("f", "json");
  arcgisUrl.searchParams.set("pageSize", "20");
  arcgisUrl.searchParams.set("icon", "svg")

  const passthroughParams = ["xmin", "xmax", "ymin", "ymax", "categories", "searchText", "pageSize", "page"];
  for (const key of passthroughParams) {
    const val = searchParams.get(key);
    if (val !== null) {
      arcgisUrl.searchParams.set(key, val);
    }
  }

  try {
    const response = await fetch(arcgisUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      return NextResponse.json(
          {
            error: "Error fetching places from ArcGIS",
            status: response.status,
            details: text || undefined,
          },
          { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {

    console.error("Error calling ArcGIS Places API", error);
    return NextResponse.json(
        { error: "Failed to contact ArcGIS Places API" },
        { status: 502 }
    );
  }
}