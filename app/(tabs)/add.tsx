import { Redirect } from "expo-router";

/**
 * Placeholder route for the center tab slot. The tab bar intercepts the
 * press to open the modal, so this should never actually render — but if
 * it's reached directly, bounce to the add modal.
 */
export default function AddTabPlaceholder() {
  return <Redirect href="/transaction/new" />;
}
