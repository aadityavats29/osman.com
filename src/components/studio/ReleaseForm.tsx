"use client";

import { useActionState } from "react";
import type { ReleaseRecord } from "@/lib/types";
import { deleteReleaseAction, saveReleaseAction } from "@/server/actions/releases";
import { initialActionState } from "./actionState";
import { DangerZone } from "./DangerZone";
import {
  CheckboxField,
  FormError,
  PublishButtons,
  SelectField,
  TextField,
  TextareaField,
} from "./fields";

export function ReleaseForm({ release }: { release?: ReleaseRecord }) {
  const [state, formAction, pending] = useActionState(saveReleaseAction, initialActionState);

  const v = (name: string, fallback?: string | null): string | undefined =>
    state.values?.[name] ?? fallback ?? undefined;
  const checked = (name: string, fallback: boolean): boolean =>
    state.values ? state.values[name] === "true" : fallback;

  return (
    <div className="max-w-xl">
      <form action={formAction} className="space-y-6">
        {release ? <input type="hidden" name="id" value={release.id} /> : null}
        <FormError errors={state.errors} />

        <TextField
          label="Title"
          name="title"
          defaultValue={v("title", release?.title)}
          errors={state.errors?.title}
        />

        <div className="grid gap-6 sm:grid-cols-2">
          <SelectField
            label="Type"
            name="releaseType"
            defaultValue={v("releaseType", release?.releaseType) ?? "SINGLE"}
            errors={state.errors?.releaseType}
            options={[
              { value: "SINGLE", label: "Single" },
              { value: "EP", label: "EP" },
              { value: "ALBUM", label: "Album" },
              { value: "COLLABORATION", label: "Collaboration" },
            ]}
          />
          <TextField
            label="Year"
            name="year"
            type="number"
            optional
            placeholder="e.g. 2024"
            defaultValue={v("year", release?.year != null ? String(release.year) : undefined)}
            errors={state.errors?.year}
          />
        </div>

        <TextField
          label="Release date"
          name="releaseDate"
          type="date"
          optional
          defaultValue={v("releaseDate", release?.releaseDate)}
          errors={state.errors?.releaseDate}
        />

        <TextField
          label="Artwork (link)"
          name="artworkUrl"
          type="url"
          optional
          help="Leave empty to use a neutral placeholder."
          defaultValue={v("artworkUrl", release?.artworkUrl)}
          errors={state.errors?.artworkUrl}
        />

        <TextareaField
          label="Description"
          name="description"
          optional
          rows={4}
          defaultValue={v("description", release?.description)}
          errors={state.errors?.description}
        />

        <TextareaField
          label="Credits"
          name="credits"
          optional
          rows={3}
          help="Who played what — e.g. Osman Meyredi: keyboards."
          defaultValue={v("credits", release?.credits)}
          errors={state.errors?.credits}
        />

        <fieldset className="space-y-5 rounded-md border border-line p-4">
          <legend className="px-1 text-sm font-medium text-ink">Listening links</legend>
          <p className="text-xs leading-relaxed text-ink-faint">
            Add the links that exist — only filled-in platforms are shown on the site.
          </p>
          <TextField
            label="Spotify"
            name="spotifyUrl"
            type="url"
            optional
            defaultValue={v("spotifyUrl", release?.spotifyUrl)}
            errors={state.errors?.spotifyUrl}
          />
          <TextField
            label="Apple Music"
            name="appleMusicUrl"
            type="url"
            optional
            defaultValue={v("appleMusicUrl", release?.appleMusicUrl)}
            errors={state.errors?.appleMusicUrl}
          />
          <TextField
            label="Bandcamp"
            name="bandcampUrl"
            type="url"
            optional
            defaultValue={v("bandcampUrl", release?.bandcampUrl)}
            errors={state.errors?.bandcampUrl}
          />
          <TextField
            label="YouTube"
            name="youtubeUrl"
            type="url"
            optional
            defaultValue={v("youtubeUrl", release?.youtubeUrl)}
            errors={state.errors?.youtubeUrl}
          />
          <TextField
            label="Other"
            name="otherUrl"
            type="url"
            optional
            defaultValue={v("otherUrl", release?.otherUrl)}
            errors={state.errors?.otherUrl}
          />
        </fieldset>

        <CheckboxField
          label="Highlight on the homepage"
          name="featured"
          defaultChecked={checked("featured", release?.featured ?? false)}
        />

        <PublishButtons isPublished={release?.status === "PUBLISHED"} />
        {pending ? <p className="text-xs text-ink-faint">Saving…</p> : null}
      </form>

      {release ? (
        <DangerZone action={deleteReleaseAction} id={release.id} noun="release" />
      ) : null}
    </div>
  );
}
