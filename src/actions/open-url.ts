import {
	action,
	DidReceiveSettingsEvent,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";
import streamDeck from "@elgato/streamdeck";

type OpenUrlSettings = {
	url?: string;
	title?: string;
};

@action({ UUID: "com.ehvg.streamdeck.open-url" })
export class OpenUrlAction extends SingletonAction<OpenUrlSettings> {
	override async onWillAppear(ev: WillAppearEvent<OpenUrlSettings>): Promise<void> {
		await this.refreshTitle(ev);
	}

	override async onDidReceiveSettings(ev: DidReceiveSettingsEvent<OpenUrlSettings>): Promise<void> {
		await this.refreshTitle(ev);
	}

	override async onKeyDown(ev: KeyDownEvent<OpenUrlSettings>): Promise<void> {
		const url = (ev.payload.settings.url ?? "").trim();
		if (!url) {
			await ev.action.showAlert();
			return;
		}

		const normalized = normalizeUrl(url);
		if (!normalized) {
			await ev.action.showAlert();
			return;
		}

		try {
			await streamDeck.system.openUrl(normalized);
			await ev.action.showOk();
		} catch (error) {
			await ev.action.showAlert();
			const message = error instanceof Error ? error.message : String(error);
			throw new Error(`Open URL failed: ${message}`);
		}
	}

	private async refreshTitle(
		ev: WillAppearEvent<OpenUrlSettings> | DidReceiveSettingsEvent<OpenUrlSettings>,
	): Promise<void> {
		if (!ev.action.isKey()) {
			return;
		}
		const title = (ev.payload.settings.title ?? "").trim();
		await ev.action.setTitle(title || "URL");
	}
}

/**
 * Accepts bare hosts (example.com) and full URLs; rejects empty / javascript: schemes.
 */
function normalizeUrl(raw: string): string | undefined {
	const trimmed = raw.trim();
	if (!trimmed) {
		return undefined;
	}

	const withScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) ? trimmed : `https://${trimmed}`;

	let parsed: URL;
	try {
		parsed = new URL(withScheme);
	} catch {
		return undefined;
	}

	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
		return undefined;
	}

	return parsed.toString();
}
