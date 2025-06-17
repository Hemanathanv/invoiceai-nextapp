// Name: V.Hemanathan
// Describe: service to handle invoice fields operations
// Framework: Next.js -15.3.2 , supabase

import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

const supabase = createClient();

export interface FieldArray {
  name: string;
  description: string;
}

export const getInvoiceFields = async (userId: string): Promise<{ standard_fields: FieldArray[]; custom_fields: FieldArray[] } | null> => {
  const { data, error } = await supabase
    .from("invoice_fields")
    .select("standard_fields, custom_fields")
    .eq("id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching fields:", error);
    toast.error("Failed to load fields");
    return null;
  }

  return data || { standard_fields: [], custom_fields: [] };
};

export const addCustomField = async (
  userId: string,
  newField: FieldArray,
  currentStandard: FieldArray[],
  currentCustom: FieldArray[]
): Promise<FieldArray[] | null> => {
  const updatedCustom = [...currentCustom, newField];
  const { error } = await supabase
    .from("invoice_fields")
    .upsert({ id: userId, standard_fields: currentStandard, custom_fields: updatedCustom }, { onConflict: "id" });

  if (error) {
    console.error("Failed to add custom field:", error);
    toast.error("Failed to add custom field");
    return null;
  }

  toast.success(`Field "${newField.name}" added.`);
  return updatedCustom;
};

export const updateField = async (
  userId: string,
  updatedStandard: FieldArray[],
  updatedCustom: FieldArray[]
): Promise<boolean> => {
  const { error } = await supabase
    .from("invoice_fields")
    .upsert({ id: userId, standard_fields: updatedStandard, custom_fields: updatedCustom }, { onConflict: "id" });

  if (error) {
    console.error("Failed to update field:", error);
    toast.error("Failed to update field");
    return false;
  }

  toast.success("Field updated.");
  return true;
};

export const deleteCustomField = async (
  userId: string,
  idx: number,
  currentStandard: FieldArray[],
  currentCustom: FieldArray[]
): Promise<FieldArray[] | null> => {
  const toDelete = currentCustom[idx];
  const updatedCustom = currentCustom.filter((_, i) => i !== idx);
  const success = await updateField(userId, currentStandard, updatedCustom);

  if (!success) return null;

  toast.success(`Field "${toDelete.name}" removed.`);
  return updatedCustom;
};