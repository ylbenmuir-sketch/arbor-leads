"use client";

/**
 * Google Places Autocomplete (Places API New) for the audit form, through the Maps JavaScript API.
 * The script only loads when someone starts using the form, so the page stays fast.
 * Without NEXT_PUBLIC_GOOGLE_MAPS_KEY (or if Google refuses the key) the form uses plain typed fields instead.
 */

const KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "";
export const placesEnabled = Boolean(KEY);

/** Fired on window when Google rejects the key (wrong domain, API not enabled, billing off). */
export const PLACES_FAILED = "arbor:places-failed";

type Text = { text: string } | null;
type AddressComponent = { longText: string | null; shortText: string | null; types: string[] };

type Place = {
  id: string;
  displayName?: string | null;
  formattedAddress?: string | null;
  addressComponents?: AddressComponent[] | null;
  primaryType?: string | null;
  primaryTypeDisplayName?: string | null;
  websiteURI?: string | null;
  fetchFields(options: { fields: string[] }): Promise<{ place: Place }>;
};

type PlacePrediction = { placeId: string; text: Text; mainText: Text; secondaryText: Text; toPlace(): Place };

type PlacesLibrary = {
  AutocompleteSessionToken: new () => object;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: {
      input: string;
      sessionToken?: object;
      includedRegionCodes?: string[];
      includedPrimaryTypes?: string[];
      language?: string;
    }): Promise<{ suggestions: { placePrediction: PlacePrediction | null }[] }>;
  };
};

type MapsWindow = Window & {
  google?: { maps?: { importLibrary?: (name: string) => Promise<unknown> } };
  gm_authFailure?: () => void;
  __arborPlacesReady?: () => void;
};

let loading: Promise<PlacesLibrary> | null = null;

/** Loads the Maps JavaScript API once and resolves with its Places library. */
export function loadPlaces(): Promise<PlacesLibrary> {
  if (!KEY) return Promise.reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_KEY is not set"));
  if (loading) return loading;
  loading = new Promise<PlacesLibrary>((resolve, reject) => {
    const w = window as MapsWindow;
    // Google calls this global when the key is rejected.
    w.gm_authFailure = () => window.dispatchEvent(new Event(PLACES_FAILED));
    w.__arborPlacesReady = () => {
      const importLibrary = w.google?.maps?.importLibrary;
      if (!importLibrary) return reject(new Error("Google Maps loaded without importLibrary"));
      importLibrary("places").then((lib) => resolve(lib as PlacesLibrary), reject);
    };
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&v=weekly&loading=async&libraries=places&callback=__arborPlacesReady`;
    script.async = true;
    script.onerror = () => reject(new Error("Couldn't load Google Maps"));
    document.head.appendChild(script);
  });
  // Let a later attempt try again (for example after a dropped connection).
  loading.catch(() => {
    loading = null;
  });
  return loading;
}

export type Kind = "business" | "city";

export type Suggestion = { id: string; main: string; secondary: string; prediction: PlacePrediction };

/** Up to 5 suggestions for what they've typed, US only. Businesses, or cities for the manual City field. */
export async function suggest(kind: Kind, input: string, sessionToken: object): Promise<Suggestion[]> {
  const places = await loadPlaces();
  const { suggestions } = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
    input,
    sessionToken,
    includedRegionCodes: ["us"],
    includedPrimaryTypes: kind === "business" ? ["establishment"] : ["(cities)"],
    language: "en-US",
  });
  return suggestions
    .map((s) => s.placePrediction)
    .filter((p): p is PlacePrediction => p != null)
    .slice(0, 5)
    .map((p) => ({
      id: p.placeId,
      main: p.mainText?.text ?? p.text?.text ?? "",
      secondary: (p.secondaryText?.text ?? "").replace(/,\s*USA$/, ""),
      prediction: p,
    }));
}

export async function newSessionToken() {
  const places = await loadPlaces();
  return new places.AutocompleteSessionToken();
}

/** What the form keeps from the business they picked. */
export type PickedBusiness = {
  placeId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  category: string;
  website: string;
};

/** Looks up the picked business's details. This also closes the autocomplete session (one billed lookup). */
export async function businessDetails(s: Suggestion): Promise<PickedBusiness> {
  const { place } = await s.prediction.toPlace().fetchFields({
    fields: ["id", "displayName", "formattedAddress", "addressComponents", "primaryType", "primaryTypeDisplayName", "websiteURI"],
  });
  const part = (...types: string[]) => {
    for (const t of types) {
      const c = place.addressComponents?.find((a) => a.types.includes(t));
      if (c) return c;
    }
    return null;
  };
  const city = part("locality", "postal_town", "sublocality", "administrative_area_level_3", "neighborhood");
  const state = part("administrative_area_level_1");
  return {
    placeId: place.id || s.id,
    name: place.displayName || s.main,
    address: (place.formattedAddress ?? s.secondary).replace(/,\s*USA$/, ""),
    city: city?.longText ?? "",
    state: state?.shortText ?? "",
    category: place.primaryTypeDisplayName || prettyType(place.primaryType),
    website: place.websiteURI ?? "",
  };
}

/** "tree_service" → "Tree service" */
const prettyType = (t: string | null | undefined) => (t ? t.charAt(0).toUpperCase() + t.slice(1).replace(/_/g, " ") : "");

/** A city suggestion as "Spring Hill" + "TN" (secondary text is "TN" or "TN, USA"). */
export function cityParts(s: Suggestion) {
  const first = s.secondary.split(",")[0]?.trim() ?? "";
  return { city: s.main, state: /^[A-Z]{2}$/.test(first) ? first : "" };
}
