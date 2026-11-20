import {
	action,
	KeyDownEvent,
	SingletonAction,
	WillAppearEvent,
} from "@elgato/streamdeck";

import { runTeamsHotkey } from "../mac/run-teams-hotkey";

type TeamsToggleSettings = {
	/** Optimistic toggle: 0 = inactive/off visual, 1 = active visual. */
	optimisticState?: number;
};

/**
 * Shared optimistic Teams hotkey action (two-state key, plugin-controlled).
 */
abstract class TeamsToggleAction extends SingletonAction<TeamsToggleSettings> {
	protected abstract readonly hotkey: string;
	protected abstract readonly titleForState: [string, string];

	override async onWillAppear(ev: WillAppearEvent<TeamsToggleSettings>): Promise<void> {
		if (!ev.action.isKey()) {
			return;
		}
		const state = normalizeState(ev.payload.settings.optimisticState);
		await ev.action.setState(state);
		await ev.action.setTitle(this.titleForState[state]);
	}

	override async onKeyDown(ev: KeyDownEvent<TeamsToggleSettings>): Promise<void> {
		if (!ev.action.isKey()) {
			return;
		}

		const current = normalizeState(ev.payload.settings.optimisticState);
		const next = current === 0 ? 1 : 0;

		try {
			await runTeamsHotkey(this.hotkey);
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			ev.action.showAlert();
			throw new Error(`Teams hotkey ⌘⇧${this.hotkey.toUpperCase()} failed: ${message}`);
		}

		await ev.action.setSettings({ ...ev.payload.settings, optimisticState: next });
		await ev.action.setState(next);
		await ev.action.setTitle(this.titleForState[next]);
		await ev.action.showOk();
	}
}

function normalizeState(value: number | undefined): 0 | 1 {
	return value === 1 ? 1 : 0;
}

@action({ UUID: "com.ehvg.streamdeck.teams-mute" })
export class TeamsMuteAction extends TeamsToggleAction {
	protected override readonly hotkey = "m";
	protected override readonly titleForState: [string, string] = ["Mic", "Muted"];
}

@action({ UUID: "com.ehvg.streamdeck.teams-camera" })
export class TeamsCameraAction extends TeamsToggleAction {
	protected override readonly hotkey = "o";
	protected override readonly titleForState: [string, string] = ["Cam", "Cam Off"];
}

@action({ UUID: "com.ehvg.streamdeck.teams-raise-hand" })
export class TeamsRaiseHandAction extends TeamsToggleAction {
	protected override readonly hotkey = "k";
	protected override readonly titleForState: [string, string] = ["Hand", "Raised"];
}
