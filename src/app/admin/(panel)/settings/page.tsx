import { SettingsForm } from "@/components/admin/Forms";
import { PageHead } from "@/components/admin/ui";
import { getSettings } from "@/server/content";

export default async function SettingsPage() {
  return (
    <>
      <PageHead title="Thông tin chung" />
      <SettingsForm settings={await getSettings()} />
    </>
  );
}
