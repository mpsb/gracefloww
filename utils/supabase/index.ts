import { createClient } from "@supabase/supabase-js";
import { getDayName } from "../date";
import { Database, Tables } from "@/types/database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const dayColumnsToSelect = {
  sunday:
    "parish,church,address,phone,email,website,longitude,latitude,sunday_times",
  monday:
    "parish,church,address,phone,email,website,longitude,latitude,monday_times",
  tuesday:
    "parish,church,address,phone,email,website,longitude,latitude,tuesday_times",
  wednesday:
    "parish,church,address,phone,email,website,longitude,latitude,wednesday_times",
  thursday:
    "parish,church,address,phone,email,website,longitude,latitude,thursday_times",
  friday:
    "parish,church,address,phone,email,website,longitude,latitude,friday_times",
  saturday:
    "parish,church,address,phone,email,website,longitude,latitude,saturday_times",
};

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseKey);

export async function fetchConfessionsForToday(): Promise<
  Tables<"confession-data">[] | null
> {
  try {
    const today = getDayName(new Date());

    // Use Supabase's select with the column list
    const { data, error } = await supabaseClient
      .from("confession-data")
      .select(dayColumnsToSelect[today])
      .overrideTypes<Array<Tables<"confession-data">>>();

    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
    return null;
  }
}
