/**
 * Gadget API client instance.
 *
 * This is the single entry point for all server-side communication with the
 * Gadget backend. Import this wherever you need to query or mutate data.
 *
 * @see https://docs.gadget.dev/reference
 */
import { Client } from "@gadget-client/starter";

export const api = new Client();
