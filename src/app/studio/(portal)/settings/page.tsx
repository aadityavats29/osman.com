import { getRepos } from "@/server/repositories";
import { SettingsForm } from "@/components/studio/SettingsForm";
import { PageHeader } from "@/components/studio/PageHeader";

export const dynamic = "force-dynamic";

export const metadata = { title: "Site settings" };

export default async function SettingsPage() {
  const settings = await getRepos().settings.get();

  return (
    <div>
      <PageHeader
        title="Site settings"
        intro="The site-wide basics: homepage text, contact email, social links and the shop."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
